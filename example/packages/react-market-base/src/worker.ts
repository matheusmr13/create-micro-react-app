declare function postMessage(message: Transferable | Transferable[] | string, targetOrigin?: string, transfer?: any[]): void;

interface eventData {
  message: string
}

interface myEvent extends MessageEvent {
  data: eventData
}

onmessage = function(e: myEvent) {
  const { message } = e.data;

  console.log('HANDLING MESSAGES');

  postMessage(message);
}