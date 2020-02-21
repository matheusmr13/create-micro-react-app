import Meta from "./meta";

class FunctionMeta extends Meta {
  callMethod = (...args) => {
    const callback = this.getShared('callback');
    callback.apply(null, args);
  }

  calledMethod = (callback) => {
    this.setShared('callback', callback);
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
