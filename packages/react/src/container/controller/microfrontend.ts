import Api from '../../api';
enum STATUS {
  CREATED, // Has microfrontend on meta.json
  DISCOVERED, // ?
  LOADED, // ? Registered itself on container
  IMPORTED, // Has received files from microfrontend instance
  REGISTERED, //
  INITIALIZED,
};

interface Files {
  js ?: Array<any>;
  css ?: Array<any>
}

class Microfrontend {
  static STATUS = STATUS;

  status : STATUS;

  name : string;
  host : string;
  isLoaded : boolean = false;

  files : Files = {};
  style = []

  api ?: Api;

  errorInitializing ?: { type: any; error: any; };

  constructor(name, metaInfo) {
    this.name = name;
    this.host = metaInfo.host;
    this.files.js = metaInfo.js;
    this.files.css = metaInfo.css;

    if ((this.files.js?.length || 0) > 0) {
      this.status = STATUS.IMPORTED;
    } else {
      this.status = STATUS.CREATED;
    }
  }

  registerApi(schema) {
    this.status = STATUS.REGISTERED;
    this.api = new Api(schema, {});
  }

  setAsInitialized() {
    this.status = STATUS.INITIALIZED;
  }

  trackError(type, error) {
    this.errorInitializing = {
      type,
      error
    };
  }

  loaded() {
    this.status = STATUS.LOADED;
    this.isLoaded = true;
  }

  importScript(jsScripts) {
    this.files.js = jsScripts;
    this.status = STATUS.IMPORTED;
  }

  hasBeenLoaded() {
    return this.isLoaded;
  }

  isReady() {
    return this.status === STATUS.REGISTERED;
  }

  setStyle(style) {
    this.style = style;
  }
}

export default Microfrontend;
