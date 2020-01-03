import Shared from './../shared';
import Communication from './../communication/app-client';
import Microfrontend from './microfrontend';
import { Callback } from '../interfaces';

const shared = new Shared('__core__');
const microfrontendFolderName = 'microfrontends';

interface MicrofrontendMap {
  [key: string]: Microfrontend
}

interface Message {
  origin?: string | number
  type?: string | number
}

declare global {
  interface Event { data: any; }
}

class Controller {
  microfrontends: MicrofrontendMap = null;
  __onMicrofrontendHotReload: Callback;
  __onMicrofrontendStyleChange: Callback;
  __onMicrofrontendsRegistered: Callback;
  __onMicrofrontendsInitialized: Callback;
  __onMicrofrontendsInfosLoaded: Callback;
  __onMicrofrontendsInfosDiscovered: Callback;

  areAllMicrofrontendsOnStatus(status: string) {
    return !Object.values(this.microfrontends).find(microfrontend => microfrontend.status !== status);
  }

  handleLoadMessage = (message: Message) => () => {
    const messageMicrofrontend = this.microfrontends[message.origin];
    if (messageMicrofrontend.hasBeenLoaded()) {
      this.__onMicrofrontendHotReload();
    }
    messageMicrofrontend.loaded();
  }

  handleScriptMessage = (message: Message) => () => {
    const messageMicrofrontend = this.microfrontends[message.origin];

    messageMicrofrontend.importScript(event.data.payload);
    if (this.areAllMicrofrontendsOnStatus(Microfrontend.STATUS.IMPORTED)) {
      this.__onMicrofrontendsInfosLoaded(this.microfrontends);
    }
  }

  handleStyleMessage = (message: Message) => () => {
    const messageMicrofrontend = this.microfrontends[message.origin];
    messageMicrofrontend.setStyle(event.data.payload);
    this.__onMicrofrontendStyleChange(messageMicrofrontend.name, messageMicrofrontend.style);
  }

  getMicrofrontendsOnStatus(status: any) {
    return Object.values(this.microfrontends)
      .filter(micro => micro.status === status)
      .reduce((agg, micro) => Object.assign(agg, {[micro.name]: micro } ), {});
  }

  initialize() {
    shared.set('registerMicrofrontend', async (name: string | number, microfrontendShared: any) => {
      this.microfrontends[name].register(microfrontendShared);

      if (this.areAllMicrofrontendsOnStatus(Microfrontend.STATUS.REGISTERED)) {
        this.__onMicrofrontendsRegistered(this.microfrontends);

        const setupMicrofrontend = (method: string) => Promise.all(Object.values(this.microfrontends).map(async (micro) => {
          try {
            const promise = micro[method]() || Promise.resolve();

            if (promise instanceof Promise) {
              await promise;
              micro.setAsInitialized();
            }
          } catch (e) {
            micro.trackError(method, e);
          }
        }));

        await setupMicrofrontend('prepare');
        await setupMicrofrontend('initialize');

        if (this.areAllMicrofrontendsOnStatus(Microfrontend.STATUS.INITIALIZED)) {
          this.__onMicrofrontendsInitialized(this.microfrontends);
        }
      }
    });

    const communication = new Communication();
    communication.onMessage((message: Message) => {
      ({
        [Communication.TYPE.LOAD]: this.handleLoadMessage(message),
        [Communication.TYPE.SCRIPT]: this.handleScriptMessage(message),
        [Communication.TYPE.STYLE]: this.handleStyleMessage(message)
      }[message.type] || (() => { console.info(`Unknown type ${message.type}`); }))();
    }).initialize();

    fetch(`./${microfrontendFolderName}/meta.json`).then(response => response.json()).then(meta => {
      this.microfrontends = Object.keys(meta)
        .reduce((agg, microfrontendName) => Object.assign(agg, {
          [microfrontendName] : new Microfrontend(microfrontendName, meta[microfrontendName])
        }), {});

      shared.set('microfrontends', this.microfrontends);

      this.__onMicrofrontendsInfosDiscovered(this.getMicrofrontendsOnStatus(Microfrontend.STATUS.CREATED));

      if (this.areAllMicrofrontendsOnStatus(Microfrontend.STATUS.IMPORTED)) {
        this.__onMicrofrontendsInfosLoaded(this.microfrontends);
      }
    });
  }

  onMicrofrontendsInfosDiscovered(callback: Callback) {
    this.__onMicrofrontendsInfosDiscovered = callback;
    return this;
  }
  onMicrofrontendsInfosLoaded(callback: Callback) {
    this.__onMicrofrontendsInfosLoaded = callback;
    return this;
  }
  onMicrofrontendHotReload(callback: Callback) {
    this.__onMicrofrontendHotReload = callback;
    return this;
  }
  onMicrofrontendStyleChange(callback: Callback) {
    this.__onMicrofrontendStyleChange = callback;
    return this;
  }
  onMicrofrontendsRegistered(callback: Callback) {
    this.__onMicrofrontendsRegistered = callback;
    return this;
  }
  onMicrofrontendsInitialized(callback: Callback) {
    this.__onMicrofrontendsInitialized = callback;
    return this;
  }
}

export default Controller;
