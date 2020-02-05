import Meta from "./meta";

const SUBSCRIPTIONS = 'SUBSCRIPTIONS';

class Property extends Meta {
  readMethod = () => {
    return this.shared.get(this.name);
  }

  rightMethod = (...args) => {
    const [newState] = args;
    this.shared.set(this.name, newState);
    const subscriptions = this.shared.get(SUBSCRIPTIONS) || [];
    subscriptions.forEach(subscription => subscription(newState));
  }

  subscribeMethod = (callback) => {
    const subscriptions = this.shared.get(SUBSCRIPTIONS) || [];
    subscriptions.push(callback);
    this.shared.set(SUBSCRIPTIONS, subscriptions);
  }

  build() {
    const name = this.getCapitalizedName();
    return {
      [`set${name}`]: this.rightMethod,
      [`get${name}`]: this.readMethod,
      [`on${name}Change`]: this.subscribeMethod
    };
  }
};

export default Property;
