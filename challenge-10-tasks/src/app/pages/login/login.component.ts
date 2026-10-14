import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent {
  email = '';
  password = '';
  submitting = signal(false);
  showPassword = signal(false);

  toggleShowPassword(): void {
    this.showPassword.update((v) => !v);
  }

  constructor(private authService: AuthService, private router: Router) {}

  get error() {
    return this.authService.error();
  }

  async onSubmit(): Promise<void> {
    this.submitting.set(true);
    const ok = await this.authService.login(this.email, this.password);
    this.submitting.set(false);
    if (ok) {
      this.router.navigate(['/tasks']);
    }
  }
}
