import { Injectable, computed, signal } from '@angular/core';
import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
  User,
} from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { AppUser } from '../models';
import { firebaseAuth, firebaseConfigured, firestore } from './firebase';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly _user = signal<AppUser | null>(null);
  readonly user = this._user.asReadonly();
  readonly isLoggedIn = computed(() => this._user() !== null);
  readonly isAdmin = computed(() => this._user()?.role === 'admin');

  /** Se resuelve cuando Firebase informa el estado inicial de la sesión (lo usan los guards). */
  readonly ready: Promise<void>;

  constructor() {
    if (!firebaseConfigured) {
      this.ready = Promise.resolve();
      return;
    }
    this.ready = new Promise((resolve) => {
      onAuthStateChanged(firebaseAuth(), async (fbUser) => {
        this._user.set(fbUser ? await this.loadProfile(fbUser) : null);
        resolve();
      });
    });
  }

  async register(name: string, email: string, password: string): Promise<void> {
    const cred = await createUserWithEmailAndPassword(firebaseAuth(), email, password);
    await updateProfile(cred.user, { displayName: name });
    const profile: AppUser = { uid: cred.user.uid, name, email, role: 'customer' };
    await setDoc(doc(firestore(), 'users', profile.uid), { ...profile, createdAt: Date.now() });
    this._user.set(profile);
  }

  async login(email: string, password: string): Promise<void> {
    const cred = await signInWithEmailAndPassword(firebaseAuth(), email, password);
    this._user.set(await this.loadProfile(cred.user));
  }

  async logout(): Promise<void> {
    await signOut(firebaseAuth());
    this._user.set(null);
  }

  private async loadProfile(fbUser: User): Promise<AppUser> {
    const snap = await getDoc(doc(firestore(), 'users', fbUser.uid));
    if (snap.exists()) return snap.data() as AppUser;
    // El documento puede no existir aún si el registro está en curso.
    return {
      uid: fbUser.uid,
      name: fbUser.displayName ?? fbUser.email ?? 'Usuario',
      email: fbUser.email ?? '',
      role: 'customer',
    };
  }
}

/** Traduce los códigos de error de Firebase Auth a mensajes en español. */
export function authErrorMessage(error: unknown): string {
  const code = (error as { code?: string })?.code ?? '';
  const messages: Record<string, string> = {
    'auth/email-already-in-use': 'Ese correo ya está registrado.',
    'auth/invalid-email': 'El correo no es válido.',
    'auth/weak-password': 'La contraseña debe tener al menos 6 caracteres.',
    'auth/invalid-credential': 'Correo o contraseña incorrectos.',
    'auth/user-not-found': 'Correo o contraseña incorrectos.',
    'auth/wrong-password': 'Correo o contraseña incorrectos.',
    'auth/too-many-requests': 'Demasiados intentos. Intenta de nuevo en unos minutos.',
    'auth/network-request-failed': 'Sin conexión. Revisa tu internet.',
  };
  return messages[code] ?? (error instanceof Error ? error.message : 'Ocurrió un error inesperado.');
}
