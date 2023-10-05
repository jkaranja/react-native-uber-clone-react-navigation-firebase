// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

import {
  API_KEY,
  APP_ID,
  AUTH_DOMAIN,
  MESSAGING_SENDER_ID,
  PROJECT_ID,
  STORAGE_BUCKET,
} from "@env";
import { getStorage } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

//console.log(API_KEY, APP_ID)

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: API_KEY,
  authDomain: AUTH_DOMAIN,
  projectId: PROJECT_ID,
  storageBucket: STORAGE_BUCKET,
  messagingSenderId: MESSAGING_SENDER_ID,
  appId: APP_ID,
};

// Initialize Firebase only if it is not
const app = initializeApp(firebaseConfig);
// Initialize Cloud Firestore and get a reference to the service//firestore is the newer db for mobile apps
export const db = getFirestore(app);
// Initialize Cloud Storage and get a reference to the service
//Firebase stores your files in a Google Cloud Storage bucket
export const storage = getStorage(app);
// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);

//android SHA1 fingerprint-Oauth:  E9:62:14:E2:92:73:26:B3:6D:F8:95:B9:79:B8:29:89:B5:AA:FF:56
//android clientId: 227903853823-tjk1hg4gv5nqgcdvb6t95dtgb5tkr1if.apps.googleusercontent.com