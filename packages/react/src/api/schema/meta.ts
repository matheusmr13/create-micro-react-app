import connector, { dispatcher } from '../state/connector';

enum ACCESS {
  PUBLIC,
  PRIVATE,
}
class Meta {
  static ACCESS = ACCESS;
  name: string;
  packageName: string;
  access: ACCESS;
  private shared: any;

  constructor(props, shared) {
    this.name = props.name;
    this.packageName = props.packageName;
    this.access = props.access || Meta.ACCESS.PRIVATE;
    this.shared = shared;
  }

  getCapitalizedName() {
    return `${this.name.charAt(0).toUpperCase()}${this.name.substring(1)}`;
  }

  build() {
    throw new Error('Not implemented');
  }

  getShared(key) {
    return this.shared.get(key);
  }
  setShared(key, value) {
    this.shared.set(key, value);
  }
  updateShared(key, map) {
    const oldValue = this.getShared(key);
    const newValue = map(oldValue);
    this.setShared(key, newValue);
    return newValue;
  }

  connectMethod = (component) => {
    return connector(component, this.packageName, this.name);
  };

  dispatch = (action, payload) => {
    dispatcher(action, payload);
  };

  static create(Clazz, props, shared) {
    return new Clazz(props, shared);
  }
}

export default Meta;
