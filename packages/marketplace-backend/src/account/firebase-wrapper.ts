import Firebase from 'firebase-admin';
import { getGoogleApplicationCredentialsPath } from '../config';

const googleApplicationCredentials = getGoogleApplicationCredentialsPath();
if (!googleApplicationCredentials) throw new Error('Configure GOOGLE_APPLICATION_CREDENTIALS env');
var serviceAccount = require(googleApplicationCredentials);

Firebase.initializeApp({
  credential: Firebase.credential.cert(serviceAccount),
  projectId: 'microfrontend-marketplace',
  databaseURL: 'https://microfrontend-marketplace.firebaseio.com',
});

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
