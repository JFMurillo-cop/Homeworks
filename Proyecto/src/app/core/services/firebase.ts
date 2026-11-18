import { initializeApp, FirebaseApp } from 'firebase/app';
import { getAuth, Auth } from 'firebase/auth';
import { getFirestore, Firestore } from 'firebase/firestore';
import { environment } from '../../../environments/environment';

/** true cuando environment.ts ya tiene las credenciales reales del proyecto. */
export const firebaseConfigured = !environment.firebase.apiKey.startsWith('TU_');

let app: FirebaseApp | null = null;
let auth: Auth | null = null;
let db: Firestore | null = null;

if (firebaseConfigured) {
  app = initializeApp(environment.firebase);
  auth = getAuth(app);
  db = getFirestore(app);
}

export const NOT_CONFIGURED_MSG =
  'Firebase no está configurado. Agrega tus credenciales en src/environments/environment.ts';

export function firebaseAuth(): Auth {
  if (!auth) throw new Error(NOT_CONFIGURED_MSG);
  return auth;
}

export function firestore(): Firestore {
  if (!db) throw new Error(NOT_CONFIGURED_MSG);
  return db;
}
