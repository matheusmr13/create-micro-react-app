import Meta from "./meta";

const SUBSCRIPTIONS = 'SUBSCRIPTIONS';

class Property extends Meta {
  constructor(props, shared) {
    super(props, shared);

    const name = this.getCapitalizedName();
    this.NAMES = {
      WRITE: `set${name}`,
      READ: `get${name}`,
      SUBSCRIBE: `on${name}Change`,
      CONNECT: `with${name}`
    };
  }
  readMethod = () => {
    return this.getShared(this.name);
  }

  writeMethod = (...args) => {
    const [newState] = args;

    this.setShared(this.name, newState);

    const subscriptions = this.getShared(SUBSCRIPTIONS) || [];
    subscriptions.forEach(subscription => subscription(newState));

    this.dispatch(this.NAMES.WRITE, newState);
  }

  subscribeMethod = (callback) => {
    this.updateShared(SUBSCRIPTIONS, (subscriptions = []) => subscriptions.concat([callback]));
  }

  build() {
    return {
      [this.NAMES.WRITE]: this.writeMethod,
      [this.NAMES.READ]: this.readMethod,
      [this.NAMES.SUBSCRIBE]: this.subscribeMethod,
      [this.NAMES.CONNECT]: this.connectMethod
    };
  }

  getReducers() {
    return {
      [this.NAMES.WRITE]: (state, { payload } = {}) => ({
        ...state,
        [this.name]: payload
      })
    }
  }
};

export default Property;
