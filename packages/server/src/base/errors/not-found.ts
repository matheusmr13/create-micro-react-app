import RequestError from './request-error';

class NotFoundError extends RequestError {
  constructor() {
    super(404);
  }
}

export default NotFoundError;
