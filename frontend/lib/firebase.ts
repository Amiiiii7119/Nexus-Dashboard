import { initializeApp, getApps, type FirebaseApp } from "firebase/app";
import { getAuth, type Auth } from "firebase/auth";

const firebaseConfig = {
  apiKey:            "AIzaSyDfMx9oMwg98nyncNckPLCIoyA2CVZ_k98",
  authDomain:        "soultrek-2d066.firebaseapp.com",
  projectId:         "soultrek-2d066",
  storageBucket:     "soultrek-2d066.firebasestorage.app",
  messagingSenderId: "1037014557974",
  appId:             "1:1037014557974:web:9686d204fa823a63dd5c37",
};

let _app: FirebaseApp | undefined;
let _auth: Auth | undefined;

function getFirebaseApp() {
  if (!_app) {
    _app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
  }
  return _app;
}

export function getFirebaseAuth(): Auth {
  if (!_auth) {
    _auth = getAuth(getFirebaseApp());
  }
  return _auth;
}
