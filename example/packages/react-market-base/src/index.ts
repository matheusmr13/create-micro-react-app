const LISTENERS = '__listeners__';

interface handleOptions {
  limitCount: number
}

interface ListenersMap {
  [namespace: string]: (data:string) => void
}

declare global {
  interface Window { [LISTENERS]: ListenersMap }
}

class EventManager {
  _namespace: string

  constructor(namespace: string) {
    this.namespace = namespace;
  }

  set namespace(namespace: string) {
    if (!window[LISTENERS]) {
      window[LISTENERS] = {}
    }

    this._namespace = namespace;
  }

  get listeners() {

  }

  dispatch(name: string, data: any) {
    const event = new CustomEvent(name, { detail: data });

    window.dispatchEvent(event);
  }

  on(eventName: string, callback: (data: any) => void, options: handleOptions = { limitCount: 0 }) {
    const { limitCount } = options;

    let count = 0;
    const handleEvent = (callback: EventListenerOrEventListenerObject) => (event: CustomEvent) => {
      if (limitCount > 0 && count >= limitCount) {
        window.removeEventListener(eventName, callback);
        return;
      }

      const { detail: data } = event;
      
      callback(data);
      count++;
    }


    window.addEventListener(eventName, handleEvent(callback));
  }
}

export default EventManager;
