// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAMFRX2mOcPAIJ78OADpckD1dGfJBRF_aQ",
  authDomain: "pantry-tracker-4df33.firebaseapp.com",
  projectId: "pantry-tracker-4df33",
  storageBucket: "pantry-tracker-4df33.appspot.com",
  messagingSenderId: "480868053356",
  appId: "1:480868053356:web:1e9d1f57195d67f45e0349",
  measurementId: "G-LMBBG9J3RZ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
let analytics = getAnalytics(app);
export const db = getFirestore(app);

// Initialize Analytics if supported
if (typeof window !== 'undefined') {
  isSupported().then((supported) => {
    if (supported) {
      analytics = getAnalytics(app);
    }
  }).catch((error) => {
    console.error("Firebase Analytics is not supported in this environment:", error);
  });
}

export { db, app, analytics };
