class Shared {
  shared = {};
  sharedName = '';

  constructor(sharedName) {
    this.sharedName = sharedName;
    const allShared = window['__shared__'] || {};
    this.shared = allShared[sharedName] || {};


    allShared[sharedName] = this.shared;
    window['__shared__'] = allShared;
  }

  set(key, value) {
    this.shared[key] = value;
  }

  get(key) {
    return this.shared[key];
  }

  withScope(scope) {
    return new Shared(`${this.sharedName}.${scope}`);
  }

}

export default Shared;
