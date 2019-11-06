const EVENTS = '__events__';
const LISTENERS = '__listeners__';

type CustomEventsArrayOrEmptyArray = Array<CustomEvent<any>> | [];
interface EventsArrayMap {
  [eventName: string]: CustomEventsArrayOrEmptyArray
}

type Listener = (data: any) => void;
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

interface handlerOptions {
  latest: boolean
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

    this.clear();
  }

  dispatch(data: any) {
    this.events = this.events.concat(data);

    if (!this.listeners.length) return;
  
    this.listeners.forEach((callback: Listener) => callback(data));
  }

  on(callback: Listener, options: handlerOptions = { latest: false }) {
    const { latest } = options;

    const events = this.events;

    if (latest && events.length > 0) {
      const lastEvent = events.pop();

      callback(lastEvent);

      this.events = events;
    }

    this.listeners = this.listeners.concat(callback as never);
  }

  clear() {
    this.events = [];
    this.listeners = [];
  }
}

export default EventManager;
