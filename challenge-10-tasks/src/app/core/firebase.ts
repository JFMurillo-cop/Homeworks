import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { environment } from '../../environments/environment';

// Un único punto de inicialización de Firebase para toda la app.
// Los servicios (AuthService, TasksService) consumen `auth` y `db` desde aquí,
// actuando como la capa de "custom hooks" que encapsula la lógica de Firebase.
export const firebaseApp = initializeApp(environment.firebaseConfig);
export const auth = getAuth(firebaseApp);
export const db = getFirestore(firebaseApp);
