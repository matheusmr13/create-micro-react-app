import Shared from './../shared';
import Communication from './../communication/app-client';
import Microfrontend from './microfrontend';
import Api from '../api';

const shared = new Shared('__core__');
const microfrontendFolderName = 'microfrontends';

declare global {
  interface Event {
    data?: any
  }
}

class Controller {
  __onMicrofrontendsInfosLoaded(microfrontends: any) {
    throw new Error("Method not implemented.");
  }
  __onMicrofrontendStyleChange(name: any, style: any) {
    throw new Error("Method not implemented.");
  }
  __onMicrofrontendHotReload() {
    throw new Error("Method not implemented.");
  }

  containerLib: any
  microfrontends: any = null;

  constructor(containerSchema) {
    if (containerSchema) {
      this.containerLib = new Api(containerSchema, { apiAccess: Api.ACCESS.INTERNAL });
      this.containerLib.name = containerSchema.packageName;
    }
  }

  areAllMicrofrontendsOnStatus(status) {
    return !Object.values(this.microfrontends).find((microfrontend: any) => microfrontend.status !== status);
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

    messageMicrofrontend.importScript(message.data.payload);
    if (this.areAllMicrofrontendsOnStatus(Microfrontend.STATUS.IMPORTED)) {
      this.__onMicrofrontendsInfosLoaded(this.microfrontends);
    }
  }

  handleStyleMessage = message => () => {
    const messageMicrofrontend = this.microfrontends[message.origin];
    messageMicrofrontend.setStyle(message.data.payload);
    this.__onMicrofrontendStyleChange(messageMicrofrontend.name, messageMicrofrontend.style);
  }

  getMicrofrontendsOnStatus(status) {
    return Object.values(this.microfrontends)
      .filter((micro: any) => micro.status === status)
      .reduce((agg, micro: any) => Object.assign(agg, {[micro.name]: micro } ), {});
  }

  async setupAllMicrofrontends() {
    if (this.containerLib) {
      this.containerLib.prepare && this.containerLib.prepare();
      this.containerLib.initialize && this.containerLib.initialize();
    }

    const setupMicrofrontend = (method) => Promise.all(Object.values(this.microfrontends).map(async (micro: any) => {
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
  __onMicrofrontendsInitialized(microfrontends: any) {
    throw new Error("Method not implemented.");
  }

  initialize() {
    shared.set('registerMicrofrontend', async (name, microfrontendShared) => {

      const lib = microfrontendShared && new Api(microfrontendShared, { apiAccess: Api.ACCESS.INTERNAL, packageName: name });
      this.microfrontends[name].register(lib);

      if (this.areAllMicrofrontendsOnStatus(Microfrontend.STATUS.REGISTERED)) {
        const store: any = this.__onMicrofrontendsRegistered(this.microfrontends);

        if (this.containerLib) {
          store.injectReducer(this.containerLib.name, this.containerLib.reducers)
        }

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
  __onMicrofrontendsRegistered(microfrontends: any) {
    throw new Error("Method not implemented.");
  }
  __onMicrofrontendsInfosDiscovered(arg0: unknown) {
    throw new Error("Method not implemented.");
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
