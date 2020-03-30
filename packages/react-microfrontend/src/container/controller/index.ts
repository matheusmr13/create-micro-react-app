import Shared from '../../api/shared';
import Communication from '../communication';
import Microfrontend from './microfrontend';
import Api from '../../api';
import fetchRetry from '../../base/fetch-retry';

const shared = new Shared('__core__');
const microfrontendFolderName = 'microfrontends';

declare global {
  interface Event {
    data?: any
  }
}

const RETRY_CONFIG = {
  LIMIT: 5,
  DELAY: 3000
}

enum CALLBACKS {
  MICROFRONTENDS_INFOS_DISCOVERED,
  MICROFRONTENDS_INFOS_LOADED,
  MICROFRONTEND_HOT_RELOADED,
  MICROFRONTEND_STYLE_CHANGED,
  MICROFRONTENDS_REGISTERED,
  MICROFRONTENDS_INITIALIZED
}

class Controller {
  private containerApi: any
  private microfrontends : { [key : string] : Microfrontend; } = {};
  private callbacks : { [key in keyof typeof CALLBACKS] ?: Function; } = {};

  constructor(containerSchema) {
    if (containerSchema) {
      this.containerApi = new Api(containerSchema, { apiAccess: Api.ACCESS.INTERNAL });
      this.containerApi.name = containerSchema.packageName;
    }
  }

  areAllMicrofrontendsOnStatus(status) {
    return !Object.values(this.microfrontends).find((microfrontend: any) => microfrontend.status !== status);
  }

  handleLoadMessage = message => () => {
    const messageMicrofrontend = this.microfrontends[message.origin];
    if (messageMicrofrontend.hasBeenLoaded()) {
      this.call(CALLBACKS.MICROFRONTEND_HOT_RELOADED);
    }
    messageMicrofrontend.loaded();
  }

  handleScriptMessage = message => () => {
    const messageMicrofrontend = this.microfrontends[message.origin];

    messageMicrofrontend.importScript(message.payload);
    if (this.areAllMicrofrontendsOnStatus(Microfrontend.STATUS.IMPORTED)) {
      this.call(CALLBACKS.MICROFRONTENDS_INFOS_LOADED, this.microfrontends);
    }
  }

  handleStyleMessage = message => () => {
    const messageMicrofrontend = this.microfrontends[message.origin];
    messageMicrofrontend.setStyle(message.payload);
    this.call(CALLBACKS.MICROFRONTEND_STYLE_CHANGED, messageMicrofrontend.name, messageMicrofrontend.style);
  }

  getMicrofrontendsOnStatus(status) {
    return Object.values(this.microfrontends)
      .filter((micro: any) => micro.status === status)
      .reduce((agg, micro: any) => Object.assign(agg, {[micro.name]: micro } ), {});
  }

  async setupAllMicrofrontends() {
    // if (this.containerApi) {
    //   this.containerApi.prepare && this.containerApi.prepare();
    //   this.containerApi.initialize && this.containerApi.initialize();
    // }

    const setupMicrofrontend = (method) => Promise.all(Object.values(this.microfrontends).map(async (micro: any) => {
    //   try {
    //     const s = Promise.resolve();
    //     const promise = (micro[method] || (() => s))() || s;

    //     if (promise instanceof Promise) {
    //       await promise;
          micro.setAsInitialized();
    //     }
    //   } catch (e) {
    //     micro.trackError(method, e);
    //   }
    }));

    await setupMicrofrontend('prepare');
    // await setupMicrofrontend('initialize');

    if (this.areAllMicrofrontendsOnStatus(Microfrontend.STATUS.INITIALIZED)) {
      this.call(CALLBACKS.MICROFRONTENDS_INITIALIZED, this.microfrontends);
    }

    return Promise.resolve();
  }

  initialize() {
    shared.set('registerMicrofrontend', async (name, schema) => {
      this.microfrontends[name].registerApi(schema);

      if (this.areAllMicrofrontendsOnStatus(Microfrontend.STATUS.REGISTERED)) {
        this.call(CALLBACKS.MICROFRONTENDS_REGISTERED, this.microfrontends);

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

    fetchRetry(`./${microfrontendFolderName}/meta.json`,{
      limit: RETRY_CONFIG.LIMIT,
      delay: RETRY_CONFIG.DELAY
    }).then(meta => {
      this.microfrontends = Object.keys(meta)
        .reduce((agg, microfrontendName) => Object.assign(agg, {
          [microfrontendName] : new Microfrontend(microfrontendName, meta[microfrontendName])
        }), {});

      this.call(CALLBACKS.MICROFRONTENDS_INFOS_DISCOVERED, this.getMicrofrontendsOnStatus(Microfrontend.STATUS.CREATED));

      if (this.areAllMicrofrontendsOnStatus(Microfrontend.STATUS.IMPORTED)) {
        this.call(CALLBACKS.MICROFRONTENDS_INFOS_LOADED, this.microfrontends);
      }
    }).catch(e => console.info(e));
  }

  on(event:CALLBACKS) {
    return (callback) => {
      this.callbacks[event] = callback;
      return this
    };
  }
  call(event : CALLBACKS, ...args) {
    const callback = this.callbacks[event];
    if (callback) callback.apply(this, args);
  }

  onMicrofrontendsInfosDiscovered = this.on(CALLBACKS.MICROFRONTENDS_INFOS_DISCOVERED);
  onMicrofrontendsInfosLoaded = this.on(CALLBACKS.MICROFRONTENDS_INFOS_LOADED)
  onMicrofrontendHotReload = this.on(CALLBACKS.MICROFRONTEND_HOT_RELOADED)
  onMicrofrontendStyleChange = this.on(CALLBACKS.MICROFRONTEND_STYLE_CHANGED)
  onMicrofrontendsRegistered = this.on(CALLBACKS.MICROFRONTENDS_REGISTERED)
  onMicrofrontendsInitialized = this.on(CALLBACKS.MICROFRONTENDS_INITIALIZED)
}

export default Controller;
