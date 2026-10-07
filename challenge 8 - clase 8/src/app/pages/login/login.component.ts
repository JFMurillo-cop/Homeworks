import { Component } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  email = '';
  password = '';
  errorMessage = '';

  constructor(private authService: AuthService, private router: Router) {}

  onSubmit(form: NgForm): void {
    if (form.invalid) {
      return;
    }

    const success = this.authService.login(this.email, this.password);

    if (success) {
      this.errorMessage = '';
      this.router.navigate(['/page-one']);
    } else {
      this.errorMessage = 'Correo o contraseña incorrectos.';
    }
  }
}
