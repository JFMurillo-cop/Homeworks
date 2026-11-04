import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  imports: [FormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class LoginComponent {
  private auth = inject(AuthService);
  private router = inject(Router);

  email = '';
  clave = '';
  msg = '';

  async entrar() {
    this.msg = '';
    const { error } = await this.auth.entrar(this.email, this.clave);
    if (error) this.msg = error.message;
    else this.router.navigate(['/tareas']);
  }

  async registrar() {
    this.msg = '';
    const { data, error } = await this.auth.registrar(this.email, this.clave);
    if (error) {
      this.msg = error.message;
    } else if (data.session) {
      // Con "Confirm email" desactivado, el registro ya inicia sesión
      this.router.navigate(['/tareas']);
    } else {
      this.msg = 'Revisa tu correo';
    }
  }
}
