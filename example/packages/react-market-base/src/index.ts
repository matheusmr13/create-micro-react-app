import * as workerPath from "file-loader?name=[name].js!./worker";

interface CustomMessageEvent extends MessageEvent {
  data: string;
}

interface MessageWorkers {
  [namespace: string]: Worker
}

class MessageWorker {
  static _workers: MessageWorkers = {};

  namespace: string;

  constructor(namespace: string) {
    const worker = new Worker(workerPath);

    MessageWorker._workers[namespace] = worker;
    this.namespace = namespace;
  }

  get worker() {
    return MessageWorker._workers[this.namespace];
  }

  sendMessage(message: string) {
    this.worker.postMessage({ message });
  }

  onMessage(onMessage: (arg0: string) => void, onError: (this: AbstractWorker, ev: ErrorEvent) => any) {
    this.worker.onmessage = ({ data }: CustomMessageEvent) => {
      onMessage(data)
    }

    this.worker.onerror = onError;
  }
}

export default MessageWorker;

