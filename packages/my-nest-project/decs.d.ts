// declare module 'octokat';
declare namespace Express {
  export interface Request {
    locals?: {
      user: import('./src/users/dto/user').default;
    };
  }
}
