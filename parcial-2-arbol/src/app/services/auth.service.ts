import { Injectable, signal, computed } from '@angular/core';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  User,
} from 'firebase/auth';
import { auth } from '../core/firebase';

export interface AuthUser {
  uid: string;
  email: string | null;
}

// Servicio que encapsula toda la lógica de autenticación de Firebase.
// El resto de la app solo conoce "isLoggedIn" / "currentUser".
@Injectable({ providedIn: 'root' })
export class AuthService {
  private userSignal = signal<AuthUser | null>(null);
  private loadingSignal = signal<boolean>(true);
  private errorSignal = signal<string | null>(null);

  readonly currentUser = this.userSignal.asReadonly();
  readonly isLoading = this.loadingSignal.asReadonly();
  readonly error = this.errorSignal.asReadonly();
  readonly isLoggedIn = computed(() => this.userSignal() !== null);

  constructor() {
    onAuthStateChanged(auth, (user: User | null) => {
      this.userSignal.set(user ? { uid: user.uid, email: user.email } : null);
      this.loadingSignal.set(false);
    });
  }

  async register(email: string, password: string): Promise<boolean> {
    this.errorSignal.set(null);
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      return true;
    } catch (err) {
      this.errorSignal.set(this.mapError(err));
      return false;
    }
  }

  async login(email: string, password: string): Promise<boolean> {
    this.errorSignal.set(null);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      return true;
    } catch (err) {
      this.errorSignal.set(this.mapError(err));
      return false;
    }
  }

  async logout(): Promise<void> {
    await signOut(auth);
  }

  private mapError(err: unknown): string {
    const code = (err as { code?: string })?.code ?? '';
    switch (code) {
      case 'auth/email-already-in-use':
        return 'Ese correo ya está registrado.';
      case 'auth/invalid-email':
        return 'El correo no es válido.';
      case 'auth/weak-password':
        return 'La contraseña debe tener al menos 6 caracteres.';
      case 'auth/invalid-credential':
      case 'auth/wrong-password':
      case 'auth/user-not-found':
        return 'Correo o contraseña incorrectos.';
      default:
        return 'Ocurrió un error. Intenta de nuevo.';
    }
  }
}
