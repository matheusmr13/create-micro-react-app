import Meta from "./meta";

const SUBSCRIPTIONS = 'SUBSCRIPTIONS';

class Property extends Meta {
  NAMES : any = null;

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

  subscribeMethod = (callback : any) => {
    this.updateShared(SUBSCRIPTIONS, (subscriptions : Array<any> = []) => subscriptions.concat([callback]));
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
      [this.NAMES.WRITE]: (state, { payload } = { payload: null }) => ({
        ...state,
        [this.name]: payload
      })
    }
  }
};

export default Property;
