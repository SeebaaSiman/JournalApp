// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore/lite";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCOkmZgwhCC3PFrJKFrxdtpsYCWFJGSnUU",
  authDomain: "journal-app-react-454aa.firebaseapp.com",
  projectId: "journal-app-react-454aa",
  storageBucket: "journal-app-react-454aa.appspot.com",
  messagingSenderId: "634072630539",
  appId: "1:634072630539:web:c28770da3fa7819e138e0e"
};

// Initialize Firebase
export const FirebaseApp = initializeApp(firebaseConfig);
export const FirebaseAuth = getAuth(FirebaseApp);
export const FirebaseDB = getFirestore(FirebaseApp);
