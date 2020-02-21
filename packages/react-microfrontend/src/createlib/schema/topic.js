import Meta from "./meta";

class TopicMeta extends Meta {
  publishToSubscribers = (...args) => {
    const subscribers = this.getShared('subscribers') || [];
    subscribers.forEach((subscriber) => {
      subscriber.apply(null, args);
    });
  }

  addSubscriber = (callback) => {
    this.updateShared('subscribers', (subscribers = []) => subscribers.concat([callback]));
  }

  build() {
    const name = this.getCapitalizedName();
    return {
      [`publishOn${name}`]: this.publishToSubscribers,
      [`subscribeTo${name}`]: this.addSubscriber
    };
  }
};

export default TopicMeta;
