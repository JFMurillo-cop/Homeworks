import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss',
})
export class RegisterComponent {
  email = '';
  password = '';
  confirmPassword = '';
  submitting = signal(false);
  showPassword = signal(false);
  showConfirmPassword = signal(false);

  readonly passwordPattern = '^(?=.*[A-Z]).{6,}$';

  constructor(private authService: AuthService, private router: Router) {}

  get error() {
    return this.authService.error();
  }

  get passwordsMismatch(): boolean {
    return this.confirmPassword.length > 0 && this.password !== this.confirmPassword;
  }

  toggleShowPassword(): void {
    this.showPassword.update((v) => !v);
  }

  toggleShowConfirmPassword(): void {
    this.showConfirmPassword.update((v) => !v);
  }

  async onSubmit(): Promise<void> {
    if (this.passwordsMismatch) return;

    this.submitting.set(true);
    const ok = await this.authService.register(this.email, this.password);
    this.submitting.set(false);
    if (ok) {
      this.router.navigate(['/explorer']);
    }
  }
}
