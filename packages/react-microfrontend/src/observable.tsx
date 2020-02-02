const EVENTS = '__events__';
const SHARED = '__shared__';
const OBSERVERS = '__observers__';

class Observable {
  _namespace

  static initialize() {
    if (!window[SHARED]) window[SHARED] = {};
    if (!window[SHARED][EVENTS]) window[SHARED][EVENTS] = {};
    if (!window[SHARED][OBSERVERS]) window[SHARED][OBSERVERS] = {};
  }

  constructor(namespace) {
    Observable.initialize();

    this.namespace = namespace;
  }

  get events() {
    return window[SHARED][EVENTS][this._namespace];
  }

  get observers() {
    return window[SHARED][OBSERVERS][this._namespace];
  }

  set events(events) {
    window[SHARED][EVENTS][this._namespace] = events;
  }

  set observers(listeners) {
    window[SHARED][OBSERVERS][this._namespace] = listeners;
  }

  set namespace(namespace) {
    this._namespace = namespace;

    if (!this.events) this.events = [];
    if (!this.observers) this.observers = [];
  }

  dispatch(data) {
    if (this.observers.length > 0) {
      this.observers.forEach((observer) => observer(data));
    } else {
      this.events = this.events.concat(data);
    };
  }

  subscribe(observer, options = { latest: false }) {
    const { latest } = options;

    const events = this.events;
    if (latest && events.length > 0) {
      const lastEvent = events.pop();

      observer(lastEvent);

      this.events = events;
    }

    this.observers = this.observers.concat(observer);
  }

  unsubscribe(observer) {
    this.observers = this.observers.filter(atualObserver => atualObserver !== observer);
  }

  clear() {
    this.events = [];
    this.observers = [];
  }
}

export default Observable;
