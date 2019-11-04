import Communication from './communication';

class AppClient extends Communication {
  constructor() {
    super();
    this.from = process.env.REACT_APP_PACKAGE_NAME;
    this.to = 'http://localhost:3000';
  }

  initialize() {
    window.addEventListener('message', (event) => {
      if (!event.data || !event.data.source || event.data.source !== Communication.COMMUNICATION_SOURCE) return;

      this.notifyMessage(event.data);
    }, false);
    return this;
  }

  onMessage(callback) {
    this.callback = callback;
    return this;
  }

  notifyMessage(message) {
    this.callback(message);
  }
}

export default AppClient;
