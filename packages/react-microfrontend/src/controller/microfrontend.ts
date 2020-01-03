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

  name
  status;
  host
  files = {
    js: null,
    css: null
  };
  style = []
  content
  isLoaded = false

  constructor(name, metaInfo) {
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

  register(shared) {
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

  trackError(type, error) {
    this.errorInitializing = {
      type,
      error
    };
  }

  loaded() {
    this.status = Microfrontend.STATUS.LOADED;
    this.isLoaded = true;
  }

  importScript(jsScripts) {
    this.files.js = jsScripts;
    this.status = Microfrontend.STATUS.IMPORTED;
  }

  hasBeenLoaded() {
    return this.isLoaded;
  }

  isReady() {
    return this.status === Microfrontend.STATUS.REGISTERED;
  }

  setStyle(style) {
    this.style = style;
  }
}

export default Microfrontend;
