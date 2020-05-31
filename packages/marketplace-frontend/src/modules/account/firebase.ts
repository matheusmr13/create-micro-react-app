import firebase from 'firebase';

const firebaseConfig = JSON.parse(process.env.REACT_APP_FIREBASE_CONFIG_JSON || '');
firebase.initializeApp(firebaseConfig);

export default firebase;
