import React from 'react';
import Shared from '../shared';
// import { connect } from 'react-redux';

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

const createLib = (toExport, meta = {}) => {
  const {
    apiAccess = BUILD_TYPE.PRIVATE_API,
    packageName
  } = meta;

  if (!packageName) throw new Error('Something went wrong');

  const stareShared = new Shared('__state__');
  const moduleShared = new Shared(packageName);

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

    // stareShared.set(subscribeFunctionName, []); TODO: check if this is the best way

    const rightApi = {
      [rightFunctionName]: (...args) => {
        currentState = args[0];

        const dispatch = stareShared.get('store').dispatch;
        dispatch(actions[rightFunctionName](currentState));

        const subscriptions = stareShared.get(subscribeFunctionName) || [];
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
        const subscriptions = stareShared.get(subscribeFunctionName) || [];
        if (type === TYPE.FUNCTION && subscriptions.length > 0) {
          throw new Error(`API typed as "${TYPE.FUNCTION}" cannot have more than one listener!`);
        }
        subscriptions.push(callback);
        stareShared.set(subscribeFunctionName, subscriptions);
      },
      ...(hasGetter ? {
        [readFunctionName]: () => {
          return currentState;
        },
        [`with${nameCapitalized}`]: (Component) => {
          const mapStateToProps = (state) => {
            return {
              [name]: state[packageName][name]
            };
          }

          let myConnect
          const list = stareShared.get('connectSet') || [];
          list.push((connect) => {
            myConnect = connect
          });
          stareShared.set('connectSet', list);

          const mapDispatchToProps = {};

          return class MyComponent extends React.Component {
            state = {
              Component: null
            }
            componentDidMount() {
              this.setState({
                Component: myConnect(
                  mapStateToProps,
                  mapDispatchToProps
                )(Component)
              })
            }

            render() {
              if (!this.state.Component) return null;
              return <this.state.Component />;
            }
          }
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
      publicApi,
      reducers: {
        [rightFunctionName]: (state, { payload } = {}) => ({
          ...state,
          [name]: payload
        })
      }
    };
  }

  const apiProps = Object.keys(toExport.interface).map(propName => createPropApi({
    ...(toExport.interface[propName]),
    name: propName
  })).reduce((agg, propApi) => Object.assign(agg, { [propApi.name] : propApi }), {})

  const globalApi = {
    getPackageName: () => packageName,
  };

  const aggregateKindFromApi = (kind) => Object.values(apiProps).reduce((agg, propApi) => Object.assign(agg, propApi[kind]), { ...globalApi });


  const getAndExec = (key) => {
    const func = moduleShared.get(key);
    return func && func();
  }
  return ({
    [BUILD_TYPE.PRIVATE_API]: {
      ...{
        onPrepare: callback => { moduleShared.set('__onPrepare__', callback); },
        onInitialize: callback => { moduleShared.set('__onInitialize__', callback); }
      },
      ...aggregateKindFromApi('privateApi')
    },
    [BUILD_TYPE.PUBLIC_API]: {
      ...aggregateKindFromApi('publicApi')
    },
    [BUILD_TYPE.INTERNAL]: {
      ...{
        prepare: () => getAndExec('__onPrepare__'),
        initialize: () => getAndExec('__onInitialize__')
      },
      reducers: aggregateKindFromApi('reducers')
    }
  })[apiAccess];
}

createLib.ACCESS = ACCESS;
createLib.TYPE = TYPE;
createLib.BUILD_TYPE = BUILD_TYPE;

export default createLib;
