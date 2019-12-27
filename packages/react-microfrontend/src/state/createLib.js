import Shared from '../shared';

const ACCESS = {
  PUBLIC: 'PUBLIC',
  PRIVATE: 'PRIVATE'
}

const TYPE = {
  PROPERTY: 'PUBLIC',
  TRIGGER: 'TRIGGER',
  FUNCTION: 'FUNCTION'
}

const BUILD_TYPE = {
  INTERNAL: 'INTERNAL',
  PUBLIC_API: 'PUBLIC_API',
  PRIVATE_API: 'PRIVATE_API'
}

const createLib = (toExport, apiAccess = BUILD_TYPE.PRIVATE_API) => {
  const stareShared = new Shared('__state__');

  const createActionCreator = (type) => (payload) => ({ type, payload });

  const createPropApi = ({
    name,
    access = ACCESS.PRIVATE,
    type = TYPE.PROPERTY,
    initialState = null
  }) => {
    const nameCapitalized = `${name.charAt(0).toUpperCase()}${name.substring(1)}`
    let currentState = initialState;

    const {
      right: rightFunctionName,
      read: readFunctionName,
      subscribe: subscribeFunctionName,
    } = ({
      [TYPE.PROPERTY]: {
        right: `set${nameCapitalized}`,
        read: `get${nameCapitalized}`,
        subscribe: `on${nameCapitalized}Change`
      },
      [TYPE.TRIGGER]: {
        right: `trigger${nameCapitalized}`,
        subscribe: `on${nameCapitalized}Triggered`
      },
      [TYPE.FUNCTION]: {
        right: `call${nameCapitalized}`,
        subscribe: `on${nameCapitalized}Called`
      }
    }[type]);

    const hasGetter = type === TYPE.PROPERTY;

    const actions = {
      [rightFunctionName]: createActionCreator(rightFunctionName),
      [subscribeFunctionName]: createActionCreator(subscribeFunctionName),
      ...(hasGetter ? { [readFunctionName]: createActionCreator(readFunctionName) } : {})
    };

    stareShared.set(subscribeFunctionName, []);

    const rightApi = {
      [rightFunctionName]: (...args) => {
        currentState = args[0];
        // const dispatch = stareShared.get('store').dispatch;

        // dispatch(actions[rightFunctionName](currentState));

        const subscriptions = stareShared.get(subscribeFunctionName);
        if (type === TYPE.FUNCTION) {
          const [currentListener] = subscriptions;
          return (currentListener && currentListener.apply(null, args));
        }
          subscriptions.forEach(subscription => subscription(currentState));
        // dispatch(actions[subscribeFunctionName]());

      }
    };

    const readApi = {
      [subscribeFunctionName]: (callback) => {
        const subscriptions = stareShared.get(subscribeFunctionName);
        if (type === TYPE.FUNCTION && subscriptions.length > 0) {
          throw new Error(`API typed as "${TYPE.FUNCTION}" cannot have more than one listener!`);
        }
        subscriptions.push(callback);
        stareShared.set(subscribeFunctionName, subscriptions);
      },
      ...(hasGetter ? {
        [readFunctionName]: () => {
          return currentState;
        }
      }: {})
    };

    const privateApi = {
      ...readApi,
      ...rightApi
    }

    const publicApi = {
      ...readApi,
      ...((type === TYPE.FUNCTION || access === ACCESS.PUBLIC) ? privateApi : readApi)
    }

    return {
      name,
      actions,
      privateApi,
      publicApi
    };
  }

  const apiProps = Object.keys(toExport.interface).map(propName => createPropApi({
    ...(toExport.interface[propName]),
    name: propName
  })).reduce((agg, propApi) => Object.assign(agg, { [propApi.name] : propApi }), {})

  const aggregateKindFromApi = (kind) => Object.values(apiProps).reduce((agg, propApi) => Object.assign(agg, propApi[kind]), {});

  const aggregatedActions = aggregateKindFromApi('actions');


  return ({
    [BUILD_TYPE.INTERNAL]: {
      actions: aggregatedActions
    },
    [BUILD_TYPE.PRIVATE_API]: {
      api: aggregateKindFromApi('privateApi'),
      actions: aggregatedActions
    },
    [BUILD_TYPE.PUBLIC_API]: {
      api: aggregateKindFromApi('publicApi'),
      actions: aggregatedActions
    }
  })[apiAccess];
}

createLib.ACCESS = ACCESS;
createLib.TYPE = TYPE;
createLib.BUILD_TYPE = BUILD_TYPE;

export default createLib;
