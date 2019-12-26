import Shared from '../shared';

const EMPTY_FUNCTION = () => null;

const ACCESS = {
  PUBLIC: 'PUBLIC',
  PRIVATE: 'PRIVATE'
}

const TYPE = {
  PROPERTY: 'PUBLIC',
  TRIGGER: 'TRIGGER'
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
      [rightFunctionName]: (newValue) => {
        currentState = newValue;
        const dispatch = stareShared.get('store').dispatch;

        dispatch(actions[rightFunctionName](currentState));
        stareShared.get(subscribeFunctionName).forEach(subscription => subscription(currentState));
        dispatch(actions[subscribeFunctionName]());
      }
    };

    const readApi = {
      [subscribeFunctionName]: (callback) => {
        const subscriptions = stareShared.get(subscribeFunctionName);
        subscriptions.push(callback);
        stareShared.set(subscribeFunctionName, subscriptions);
      },
      ...(hasGetter ? {
        [readFunctionName]: () => {
          return currentState;
        }
      }: {})
    };

    const api = {
      ...readApi,
      ...rightApi
    }

    return {
      name,
      actions,
      privateApi: api,
      publicApi: {
        ...(access === ACCESS.PUBLIC ? api : readApi)
      },
      reducers: {
        [rightFunctionName]: (state, { payload }) => ({
          ...state,
          [name]: payload
        })
      }
    };
  }

  const apiProps = Object.keys(toExport.properties).map(propName => createPropApi({
    ...(toExport.properties[propName]),
    name: propName
  })).reduce((agg, propApi) => Object.assign(agg, { [propApi.name] : propApi }), {})

  const aggregateKindFromApi = (kind) => Object.values(apiProps).reduce((agg, propApi) => Object.assign(agg, propApi[kind]), {});

  const aggregatedActions = aggregateKindFromApi('actions');

  if (apiAccess === BUILD_TYPE.INTERNAL) {
    return {
      reducers: aggregateKindFromApi('reducers'),
      api: aggregateKindFromApi('publicApi'),
      actions: aggregatedActions
    };
  }

  return {
    api: aggregateKindFromApi('privateApi'),
    actions: aggregatedActions
  };
}

createLib.ACCESS = ACCESS;
createLib.TYPE = TYPE;
createLib.BUILD_TYPE = BUILD_TYPE;

export default createLib;
