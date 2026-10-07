import { Injectable, signal, computed } from '@angular/core';

const DEMO_EMAIL = 'user@mail.com';
const DEMO_PASSWORD = '123';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  // Signal privada con el usuario actual (null = no autenticado)
  private currentUserSignal = signal<string | null>(null);

  // Signals públicas de solo lectura, derivadas del estado
  readonly currentUser = this.currentUserSignal.asReadonly();
  readonly isLoggedIn = computed(() => this.currentUserSignal() !== null);

  /**
   * Valida las credenciales contra el usuario "demo".
   * Retorna true si el login fue exitoso.
   */
  login(email: string, password: string): boolean {
    const isValid = email === DEMO_EMAIL && password === DEMO_PASSWORD;

    if (isValid) {
      this.currentUserSignal.set(email);
    }

    return isValid;
  }

  logout(): void {
    this.currentUserSignal.set(null);
  }
}
