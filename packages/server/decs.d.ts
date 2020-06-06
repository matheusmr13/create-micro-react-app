declare module 'octokat';
declare namespace Express {
  export interface Request {
    locals?: {
      user: import('./src/account/user').default;
    };
  }
}
