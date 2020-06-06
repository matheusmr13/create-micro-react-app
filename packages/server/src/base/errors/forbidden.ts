import RequestError from './request-error';

class ForbiddenError extends RequestError {
  constructor() {
    super(403);
  }
}

export default ForbiddenError;
