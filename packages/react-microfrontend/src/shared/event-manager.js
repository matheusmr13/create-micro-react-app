import Shared from './index';

const EVENTS_NAMESPACE = '__events__'

class EventManager extends Shared {
  _context;
  _events = {};

  constructor(context) {
    super(context);

    this.context = context;
  }

  set namespace(context) {
    if (!window[EVENTS_NAMESPACE]) {
      window[EVENTS_NAMESPACE] = {};
    }

    if (!window[EVENTS_NAMESPACE][context]) {
      window[EVENTS_NAMESPACE][context] = {};
    }

    this._context = context;
  }

  get events() {
    return window[EVENTS_NAMESPACE][this._context];
  }

  dispatch(name, data) {
    const event = new CustomEvent(name, { detail: data });

    window.dispatchEvent(event);
  }

  on(eventName, callback, options = {}) {
    const { limitCount } = options;

    let count = 0;
    window.addEventListener(eventName, (arguments) => {
      count++;

      callback(arguments);

      if (limitCount >= count) {
        window.removeEventListener()
      }
    });
  }
}

export default EventManager;
