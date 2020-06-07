import Firebase from 'firebase-admin';

export const initializeFirebase = (serviceAccountJson: any) => {
  Firebase.initializeApp({
    credential: Firebase.credential.cert(serviceAccountJson),
  });
};

export interface FirebaseUser {
  user_id?: string;
  name?: string;
  email?: string;
  picture?: string;
}

class FirebaseWrapper {
  static async verifyIdToken(idToken: string) {
    const firebaseUser: FirebaseUser = await Firebase.auth().verifyIdToken(idToken);
    return firebaseUser;
  }
}

export default FirebaseWrapper;
