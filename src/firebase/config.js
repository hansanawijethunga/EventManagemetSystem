import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDNEr346Q2RfGHohge_XJGC4kC6KRBrHgU",
  authDomain: "eventhub-ccd7e.firebaseapp.com",
  projectId: "eventhub-ccd7e",
  storageBucket: "eventhub-ccd7e.appspot.com",
  messagingSenderId: "683878351938",
  appId: "1:683878351938:web:32b73160d4d143ac7159db",
  measurementId: "G-0L49KMLFK8"
};

// Initialize Firebase - with a check to prevent duplicate initialization
let app;
try {
  app = initializeApp(firebaseConfig);
} catch (error) {
  // If an app is already initialized, use that one
  if (error.code === 'app/duplicate-app') {
    console.info('Firebase app already initialized, using existing app');
    app = initializeApp(firebaseConfig, 'secondary');
  } else {
    console.error('Firebase initialization error', error);
    throw error;
  }
}

const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db };