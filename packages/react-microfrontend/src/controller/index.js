import Shared from './../shared';
import Communication from './../communication/app-client';
import Microfrontend from './microfrontend';

const shared = new Shared('__core__');
const microfrontendFolderName = 'microfrontends';

class Controller {
  microfrontends = null;

  areAllMicrofrontendsOnStatus(status) {
    return !Object.values(this.microfrontends).find(microfrontend => microfrontend.status !== status);
  }

  onLoadMessage = message => () => {
    const messageMicrofrontend = this.microfrontends[message.origin];
    if (messageMicrofrontend.hasBeenLoaded()) {
      this.__onMicrofrontendHotReload();
    }
    messageMicrofrontend.loaded();
  }

  onScriptMessage = message => () => {
    const messageMicrofrontend = this.microfrontends[message.origin];

    messageMicrofrontend.importScript(event.data.payload);
    if (this.areAllMicrofrontendsOnStatus(Microfrontend.STATUS.IMPORTED)) {
      this.__onMicrofrontendsLoaded(this.microfrontends);
    }
  }

  onStyleMessage = message => () => {
    const messageMicrofrontend = this.microfrontends[message.origin];
    messageMicrofrontend.setStyle(event.data.payload);
    this.__onMicrofrontendStyleChange(messageMicrofrontend.name, messageMicrofrontend.style);
  }

  initialize() {
    shared.set('registerMicrofrontend', (name, microfrontendShared) => {
      this.microfrontends[name].register(microfrontendShared);

      if (this.areAllMicrofrontendsOnStatus(Microfrontend.STATUS.REGISTERED)) {
        this.__onMicrofrontendsInitialized(this.microfrontends);
      }
    });

    const communication = new Communication();
    communication.onMessage((message) => {
      ({
        [Communication.TYPE.LOAD]: this.onLoadMessage(message),
        [Communication.TYPE.SCRIPT]: this.onScriptMessage(message),
        [Communication.TYPE.STYLE]: this.onStyleMessage(message)
      }[message.type] || (() => { console.info(`Unknown type ${message.type}`); }))();
    }).initialize();

    fetch(`./${microfrontendFolderName}/meta.json`).then(response => response.json()).then(meta => {
      this.microfrontends = Object.keys(meta)
        .reduce((agg, microfrontendName) => Object.assign(agg, {
          [microfrontendName] : new Microfrontend(microfrontendName, meta[microfrontendName])
        }), {});

      shared.set('microfrontends', this.microfrontends);

      if (this.areAllMicrofrontendsOnStatus(Microfrontend.STATUS.CREATED)) {
        this.__onMicrofrontendsDiscovered(this.microfrontends);
      } else if (this.areAllMicrofrontendsOnStatus(Microfrontend.STATUS.IMPORTED)) {
        this.__onMicrofrontendsLoaded(this.microfrontends);
      }
    });
  }

  onMicrofrontendsDiscovered(callback) {
    this.__onMicrofrontendsDiscovered = callback;
    return this;
  }
  onMicrofrontendsLoaded(callback) {
    this.__onMicrofrontendsLoaded = callback;
    return this;
  }
  onMicrofrontendHotReload(callback) {
    this.__onMicrofrontendHotReload = callback;
    return this;
  }
  onMicrofrontendStyleChange(callback) {
    this.__onMicrofrontendStyleChange = callback;
    return this;
  }
  onMicrofrontendsInitialized(callback) {
    this.__onMicrofrontendsInitialized = callback;
    return this;
  }
}

export default Controller;
