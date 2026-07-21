import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth, browserLocalPersistence, GoogleAuthProvider } from "firebase/auth";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyCoGmQHQWxqWfA5ceKHYF6BZ5yy_8a1G60",
  authDomain: "hyderabad-flower-decorators.firebaseapp.com",
  projectId: "hyderabad-flower-decorators",
  storageBucket: "hyderabad-flower-decorators.firebasestorage.app",
  messagingSenderId: "352252304214",
  appId: "1:352252304214:web:d4f814c674618af1f5d4f7",
  measurementId: "G-HN1WYBP96Z",
};

const app = getApps().length ? getApp() : initializeApp(firebaseConfig);

// Initialize Auth and set persistence IMMEDIATELY so sessions survive page refreshes
export const auth = getAuth(app);
// Set persistence right away — resolves quickly; any subsequent
// onAuthStateChanged calls will already use the correct persistence layer.
auth.setPersistence(browserLocalPersistence).catch(() => {});

export const storage = getStorage(app);
export const googleProvider = new GoogleAuthProvider();

export default app;
