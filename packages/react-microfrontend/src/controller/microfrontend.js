

class Microfrontend {
  static STATUS = {
    DISCOVERED: 'DISCOVERED',
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

  register(lib) {
    this.status = Microfrontend.STATUS.REGISTERED;

    this.lib = lib;
    this.view = lib.view;
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
