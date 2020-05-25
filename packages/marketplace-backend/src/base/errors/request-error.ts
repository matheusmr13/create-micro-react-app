class RequestError extends Error {
  constructor(public statusCode: number) {
    super('Request error');
  }
}

export default RequestError;
