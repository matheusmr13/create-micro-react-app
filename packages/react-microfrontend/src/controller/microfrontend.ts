import CreateLib from '../state/createLib';

class Microfrontend {
  static STATUS = {
    DISCOVERED: 'DISCOVERED',
    CREATED: 'CREATED',
    LOADED: 'LOADED',
    IMPORTED: 'IMPORTED',
    REGISTERED: 'REGISTERED',
    INITIALIZED: 'INITIALIZED'
  };

  name: any
  status: string;
  host: any
  files = {
    js: null,
    css: null
  };
  style = []
  content: any
  isLoaded = false
  view: any
  lib: { initialize: any; prepare: any; }
  initialize: any
  prepare: any
  errorInitializing: { type: any; error: any; };

  constructor(name: string, metaInfo: { host: any; js: any; css: any; }) {
    this.name = name;
    this.host = metaInfo.host;
    this.files.js = metaInfo.js;
    this.files.css = metaInfo.css;

    if (this.files.js && this.files.js.length > 0) {
      this.status = Microfrontend.STATUS.IMPORTED;
    } else {
      this.status = Microfrontend.STATUS.CREATED;
    }
  }

  register(shared: { view: any; interface: any; }) {
    this.status = Microfrontend.STATUS.REGISTERED;
    this.view = shared.view;

    if (shared.interface) {
      this.lib = CreateLib(shared, { apiAccess: CreateLib.BUILD_TYPE.INTERNAL, packageName: this.name });
      this.initialize = this.lib.initialize;
      this.prepare = this.lib.prepare;
    }
  }

  setAsInitialized() {
    this.status = Microfrontend.STATUS.INITIALIZED;
  }

  trackError(type: string, error: any) {
    this.errorInitializing = {
      type,
      error
    };
  }

  loaded() {
    this.status = Microfrontend.STATUS.LOADED;
    this.isLoaded = true;
  }

  importScript(jsScripts: any) {
    this.files.js = jsScripts;
    this.status = Microfrontend.STATUS.IMPORTED;
  }

  hasBeenLoaded() {
    return this.isLoaded;
  }

  isReady() {
    return this.status === Microfrontend.STATUS.REGISTERED;
  }

  setStyle(style: any[]) {
    this.style = style;
  }
}

export default Microfrontend;
