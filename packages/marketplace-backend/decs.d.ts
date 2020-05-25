declare module 'npm-api';
declare module 'octokat';
declare namespace Express {
  export interface Request {
    locals?: any;
  }
}
