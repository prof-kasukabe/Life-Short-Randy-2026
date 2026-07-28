import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import rawConfig from '../../firebase-applet-config.json';

// Safely handle ES Module / CJS JSON import interop in Vite
const firebaseAppletConfig = (rawConfig as any)?.default || rawConfig || {};

const getVal = (envVal: string | undefined, configVal: string | undefined): string => {
  if (
    envVal && 
    typeof envVal === 'string' && 
    envVal.trim().length > 0 && 
    !envVal.toLowerCase().includes('your-') &&
    !envVal.toLowerCase().includes('your_')
  ) {
    return envVal.trim();
  }
  return configVal || '';
};

const firebaseConfig = {
  projectId: getVal(import.meta.env.VITE_FIREBASE_PROJECT_ID, firebaseAppletConfig.projectId),
  appId: getVal(import.meta.env.VITE_FIREBASE_APP_ID, firebaseAppletConfig.appId),
  apiKey: getVal(import.meta.env.VITE_FIREBASE_API_KEY, firebaseAppletConfig.apiKey),
  authDomain: getVal(import.meta.env.VITE_FIREBASE_AUTH_DOMAIN, firebaseAppletConfig.authDomain),
  storageBucket: getVal(import.meta.env.VITE_FIREBASE_STORAGE_BUCKET, firebaseAppletConfig.storageBucket),
  messagingSenderId: getVal(import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID, firebaseAppletConfig.messagingSenderId),
};

const databaseId = getVal(import.meta.env.VITE_FIREBASE_DATABASE_ID, firebaseAppletConfig.firestoreDatabaseId) || '(default)';

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app, databaseId);
export const auth = getAuth(app);


