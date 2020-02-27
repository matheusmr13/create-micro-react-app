import Communication from './communication';

class MicrofrontendClient extends Communication {
  from: string;
  to: string;

  constructor() {
    super();
    this.from = process.env.REACT_APP_PACKAGE_NAME || ''; // TODO: fix to use correct from
    this.to = 'http://localhost:3000';
  }

  send(type, payload?: any) {
    window.parent.postMessage({
      type,
      origin: this.from,
      payload,
      source: Communication.COMMUNICATION_SOURCE
    }, this.to);
  }
}

export default MicrofrontendClient;
