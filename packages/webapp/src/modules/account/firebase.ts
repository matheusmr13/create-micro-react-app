import firebase from 'firebase';

const firebaseConfig = JSON.parse(process.env.REACT_APP_FIREBASE_CONFIG || '');
firebase.initializeApp(firebaseConfig);

export default firebase;
