const EVENTS = '__events__';
const LISTENERS = '__listeners__';

type CustomEventsArrayOrEmptyArray = Array<CustomEvent<any>> | [];
interface EventsArrayMap {
  [eventName: string]: CustomEventsArrayOrEmptyArray
}

type Listener = (data:string) => void;
type ListenersArrayOrEmptyArray = Array<Listener> | [];
interface ListenersArrayMap {
  [eventName: string]: ListenersArrayOrEmptyArray
}

declare global {
  interface Window {
    [EVENTS]: EventsArrayMap,
    [LISTENERS]: ListenersArrayMap
  }
}

interface handleOptions {
  limitCount: number
}

class EventManager {
  _name: string

  static initialize() {
    if (!window[EVENTS]) window[EVENTS] = {};
    if (!window[LISTENERS]) window[LISTENERS] = {};
  }

  constructor(name: string) {
    EventManager.initialize();

    this.name = name;
  }

  get events(): CustomEventsArrayOrEmptyArray {
    return window[EVENTS][this._name];
  }

  get listeners(): ListenersArrayOrEmptyArray {
    return window[LISTENERS][this._name];
  }

  set events(events: CustomEventsArrayOrEmptyArray) {
    window[EVENTS][this._name] = events;
  }

  set listeners(listeners: ListenersArrayOrEmptyArray) {
    window[LISTENERS][this._name] = listeners;
  }

  set name(name: string) {
    this._name = name;

    this.events = [];
    this.listeners = [];
  }

  dispatch(data: any) {
    const event = new CustomEvent(this._name, { detail: data });

    if (this.listeners.length > 0) {
      window.dispatchEvent(event);
    } else {
      this.events = this.events.concat(event as never);
    }
  }

  on(callback: (data: any) => void, options: handleOptions = { limitCount: 0 }) {
    const { limitCount } = options;

    let count = 0;
    const handleEvent = (callback) => (event: CustomEvent) => {
      if (limitCount > 0 && count >= limitCount) {
        window.removeEventListener(this._name, callback);
        return;
      }

      const { detail: data } = event;

      callback(data);
      count++;
    }

    if (this.events.length > 0) {
      const events = this.events;

      const lastEvent = events.pop();

      handleEvent(callback)(lastEvent);

      this.events = events;
    }

    window.addEventListener(this._name, handleEvent(callback));

    this.listeners = this.listeners.concat(callback as never);
  }
}

export default EventManager;
