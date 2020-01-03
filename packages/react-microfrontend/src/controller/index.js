import Shared from './../shared';
import Communication from './../communication/app-client';
import Microfrontend from './microfrontend';
import CreateLib from '../state/createLib';

const shared = new Shared('__core__');
const microfrontendFolderName = 'microfrontends';

class Controller {
  constructor(containerSchema) {
    this.containerLib = containerSchema && CreateLib(containerSchema, { apiAccess: CreateLib.BUILD_TYPE.INTERNAL });
  }

  microfrontends = null;

  areAllMicrofrontendsOnStatus(status) {
    return !Object.values(this.microfrontends).find(microfrontend => microfrontend.status !== status);
  }

  handleLoadMessage = message => () => {
    const messageMicrofrontend = this.microfrontends[message.origin];
    if (messageMicrofrontend.hasBeenLoaded()) {
      this.__onMicrofrontendHotReload();
    }
    messageMicrofrontend.loaded();
  }

  handleScriptMessage = message => () => {
    const messageMicrofrontend = this.microfrontends[message.origin];

    messageMicrofrontend.importScript(event.data.payload);
    if (this.areAllMicrofrontendsOnStatus(Microfrontend.STATUS.IMPORTED)) {
      this.__onMicrofrontendsInfosLoaded(this.microfrontends);
    }
  }

  handleStyleMessage = message => () => {
    const messageMicrofrontend = this.microfrontends[message.origin];
    messageMicrofrontend.setStyle(event.data.payload);
    this.__onMicrofrontendStyleChange(messageMicrofrontend.name, messageMicrofrontend.style);
  }

  getMicrofrontendsOnStatus(status) {
    return Object.values(this.microfrontends)
      .filter(micro => micro.status === status)
      .reduce((agg, micro) => Object.assign(agg, {[micro.name]: micro } ), {});
  }

  async setupAllMicrofrontends() {
    this.containerLib.prepare && this.containerLib.prepare();
    this.containerLib.initialize && this.containerLib.initialize();

    const setupMicrofrontend = (method) => Promise.all(Object.values(this.microfrontends).map(async (micro) => {
      try {
        const s = Promise.resolve();
        const promise = (micro[method] || (() => s))() || s;

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

  initialize() {
    shared.set('registerMicrofrontend', async (name, microfrontendShared) => {

      const lib = microfrontendShared && CreateLib(microfrontendShared, { apiAccess: CreateLib.BUILD_TYPE.INTERNAL, packageName: name });
      this.microfrontends[name].register(lib);

      if (this.areAllMicrofrontendsOnStatus(Microfrontend.STATUS.REGISTERED)) {
        this.__onMicrofrontendsRegistered(this.microfrontends);

        await this.setupAllMicrofrontends();
      }
    });

    const communication = new Communication();
    communication.onMessage((message) => {
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

  onMicrofrontendsInfosDiscovered(callback) {
    this.__onMicrofrontendsInfosDiscovered = callback;
    return this;
  }
  onMicrofrontendsInfosLoaded(callback) {
    this.__onMicrofrontendsInfosLoaded = callback;
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

  onMicrofrontendsRegistered(callback) {
    this.__onMicrofrontendsRegistered = callback;
    return this;
  }
  onMicrofrontendsInitialized(callback) {
    this.__onMicrofrontendsInitialized = callback;
    return this;
  }
}

export default Controller;
