import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDr-nRZN7zACIE1b-Rst3W9qaMVOYfSLUw",
  authDomain: "eventhub-fabb6.firebaseapp.com",
  projectId: "eventhub-fabb6",
  storageBucket: "eventhub-fabb6.firebasestorage.app",
  messagingSenderId: "129220541464",
  appId: "1:129220541464:web:5e71320ceb9b4a249d976d",
  measurementId: "G-MV5T8YYMKC"
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