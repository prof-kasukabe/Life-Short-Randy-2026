import { initializeApp } from 'firebase/app';
import { initializeFirestore, getFirestore, setLogLevel, Firestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import rawConfig from '../../firebase-applet-config.json';

// Suppress verbose internal connection warning logs in iframe sandboxes
try {
  setLogLevel('silent');
} catch (e) {
  // Ignore if unsupported in environment
}

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
  projectId: firebaseAppletConfig.projectId || getVal((import.meta as any).env?.VITE_FIREBASE_PROJECT_ID, undefined),
  appId: firebaseAppletConfig.appId || getVal((import.meta as any).env?.VITE_FIREBASE_APP_ID, undefined),
  apiKey: firebaseAppletConfig.apiKey || getVal((import.meta as any).env?.VITE_FIREBASE_API_KEY, undefined),
  authDomain: firebaseAppletConfig.authDomain || getVal((import.meta as any).env?.VITE_FIREBASE_AUTH_DOMAIN, undefined),
  storageBucket: firebaseAppletConfig.storageBucket || getVal((import.meta as any).env?.VITE_FIREBASE_STORAGE_BUCKET, undefined),
  messagingSenderId: firebaseAppletConfig.messagingSenderId || getVal((import.meta as any).env?.VITE_FIREBASE_MESSAGING_SENDER_ID, undefined),
};

const databaseId = firebaseAppletConfig.firestoreDatabaseId || getVal((import.meta as any).env?.VITE_FIREBASE_DATABASE_ID, undefined) || '(default)';


const app = initializeApp(firebaseConfig);

let firestoreDb: Firestore;
try {
  firestoreDb = initializeFirestore(app, {
    experimentalForceLongPolling: true,
  }, databaseId);
} catch (e) {
  try {
    firestoreDb = initializeFirestore(app, {
      experimentalAutoDetectLongPolling: true,
    }, databaseId);
  } catch (err) {
    firestoreDb = getFirestore(app, databaseId);
  }
}

export const db = firestoreDb;
export const auth = getAuth(app);



