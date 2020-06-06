import Firebase from 'firebase-admin';

export const initializeFirebase = (serviceAccountJson: any) => {
  Firebase.initializeApp({
    credential: Firebase.credential.cert(serviceAccountJson),
    projectId: 'microfrontend-marketplace',
    databaseURL: 'https://microfrontend-marketplace.firebaseio.com',
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
