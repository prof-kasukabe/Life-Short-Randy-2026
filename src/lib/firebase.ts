import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  projectId: "industrious-tempest-23n78",
  appId: "1:352118953575:web:c4d5889541e85f95ff26c2",
  apiKey: "AIzaSyC1eBuvYG6gGRd2QsQSsa2Oi5NZwUEkpug",
  authDomain: "industrious-tempest-23n78.firebaseapp.com",
  storageBucket: "industrious-tempest-23n78.firebasestorage.app",
  messagingSenderId: "352118953575",
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app, "ai-studio-randysminimalist-ba3aef26-34b7-458d-bdeb-ece2e797db58");
export const auth = getAuth(app);
