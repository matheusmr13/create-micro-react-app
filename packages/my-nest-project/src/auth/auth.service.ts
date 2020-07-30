import { Injectable, Scope, Inject } from '@nestjs/common';
import User from 'src/users/dto/user';
import { REQUEST } from '@nestjs/core';
import { Request } from 'express';
import Firebase from 'firebase-admin';

interface FirebaseUser {
  user_id?: string;
  name?: string;
  email?: string;
  picture?: string;
}

export const initializeFirebase = (serviceAccountJson: any) => {
  Firebase.initializeApp({
    credential: Firebase.credential.cert(serviceAccountJson),
  });
};
@Injectable({ scope: Scope.REQUEST })
export class AuthService {
  constructor(@Inject(REQUEST) private request: Request) {}

  async verifyIdToken(idToken: string) {
    const firebaseUser: FirebaseUser = await Firebase.auth().verifyIdToken(
      idToken,
    );
    return new User(
      firebaseUser.user_id,
      firebaseUser.name,
      firebaseUser.email,
      firebaseUser.picture,
    );
  }

  getLoggedUser() {
    return this.request.locals.user;
  }

  injectLoggedUser(user: User) {
    console.info('injecting', user);
    this.request.locals = {
      user,
    };
  }
}
