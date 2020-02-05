import Meta from "./meta";

class FunctionMeta extends Meta {
  callMethod = (...args) => {
    this.callback.apply(null, args);
  }

  calledMethod = (callback) => {
    this.callback = callback;
  }

  build() {
    const name = this.getCapitalizedName();
    return {
      [`call${name}`]: this.callMethod,
      [`on${name}Called`]: this.calledMethod
    };
  }
};

export default FunctionMeta;
