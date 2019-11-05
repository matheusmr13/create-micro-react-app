import * as workerPath from "file-loader?name=[name].js!./worker";

interface CustomMessageEvent extends MessageEvent {
  data: string;
}

interface MessageWorkers {
  [namespace: string]: Worker
}

declare global {
  interface Window { _workers: MessageWorkers; }
}

class MessageWorker {
  private _namespace: string;

  constructor(namespace: string) {
    if (!window.Worker) throw new Error('Your browser doesn\'t support web workers :(');

    this.namespace = namespace;
  }

  set namespace(namespace: string) {
    if (!window._workers) {
      window._workers = {};
    }

    if (!window._workers[namespace]) {
      window._workers[namespace] = new Worker(workerPath);
    }

    this._namespace = namespace;
  }

  get worker() {
    return window._workers[this._namespace];
  }

  sendMessage(message: string) {
    this.worker.postMessage({ message });
  }

  onMessage(handleMessage: (arg0: string) => void, handleError: (this: AbstractWorker, ev: ErrorEvent) => any) {
    this.worker.onmessage = ({ data }: CustomMessageEvent) => {
      handleMessage(data)
    }

    this.worker.onerror = handleError;
  }
}

export default MessageWorker;

