import CreateLib from '../state/createLib';

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

  register(shared) {
    this.status = Microfrontend.STATUS.REGISTERED;
    this.view = shared.view;

    if (shared.interface) {
      this.lib = CreateLib(shared, CreateLib.BUILD_TYPE.PRIVATE_API);
    }

    const emptyFunc = () => Promise.resolve();
    this.initialize = shared.initialize ? () => shared.initialize(this.lib) : emptyFunc;
    this.prepare = shared.prepare ? () => shared.prepare(this.lib) : emptyFunc;
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
