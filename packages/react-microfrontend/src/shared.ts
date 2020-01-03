/* eslint-disable no-underscore-dangle */

class Shared {
  // static store;
  // static setStore(store) {
  //   Shared.store = store;
  // }

  shared = {};
  sharedName = '';

  constructor(sharedName) {
    this.sharedName = sharedName;
    const allShared = window.__shared__ || {};
    this.shared = allShared[sharedName] || {};


    allShared[sharedName] = this.shared;
    window.__shared__ = allShared;
  }

  // registerGetter(name, getState) {
  //   this.set(`getState.${name}`, getState);
  //   return this;
  // }

  // getState(name) {
  //   if (!Shared.store) throw new Error('Store not set yet');

  //   const getState = this.get(`getState.${name}`);
  //   if (!getState) throw new Error(`getState ${this.sharedName}.${name} not set yet`);
  //   return getState(Shared.store.getState());
  // }

  set(key, value) {
    this.shared[key] = value;
  }

  get(key) {
    return this.shared[key];
  }
}

export default Shared;
