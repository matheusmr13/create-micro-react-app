import connector, { dispatcher } from '../state/connector';

class Meta {
  static ACCESS = {
    PUBLIC: 'PUBLIC',
    PRIVATE: 'PRIVATE'
  }

  constructor(props, shared) {
    this.name = props.name;
    this.access = props.access || Meta.ACCESS.PRIVATE;
    this.__shared = shared;
  }

  getCapitalizedName() {
    return `${this.name.charAt(0).toUpperCase()}${this.name.substring(1)}`;
  }

  build() {
    throw new Error('Not implemented');
  }

  getShared(key) { return this.__shared.get(key); }
  setShared(key, value) { this.__shared.set(key, value); }
  updateShared(key, map) {
    const oldValue = this.getShared(key);
    const newValue = map(oldValue);
    this.setShared(key, newValue);
    return newValue;
  }


  connectMethod = (component) => {
    return connector(component, 'test', this.name);
  }

  dispatch = (action, payload) => {
    dispatcher(action, payload);
  }

  static create(Clazz, props, shared) {
    return new Clazz(props, shared);
  }
}

export default Meta;
