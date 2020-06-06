declare module 'octokat';
declare namespace Express {
  export interface Request {
    locals?: {
      user: import('account/user').default;
    };
  }
}
