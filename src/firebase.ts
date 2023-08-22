import { initializeApp } from 'firebase/app';
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, sendEmailVerification, onAuthStateChanged } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';


const firebaseConfig = {
    apiKey: "AIzaSyD9SaKamla7Y3kvt1BbElF8yRC-0lAaB2g",
    authDomain: "react-task-management-app.firebaseapp.com",
    projectId: "react-task-management-app",
    storageBucket: "react-task-management-app.appspot.com",
    messagingSenderId: "968005150786",
    appId: "1:968005150786:web:4567b93af7597cc72765db",
    measurementId: "G-4YTLYV902B"
  };

const firebaseApp = initializeApp(firebaseConfig);
const auth = getAuth(firebaseApp);
const firestore = getFirestore(firebaseApp);
const storage = getStorage(firebaseApp);


export { firebaseApp, auth, firestore, storage, createUserWithEmailAndPassword, signInWithEmailAndPassword, sendEmailVerification, onAuthStateChanged };
