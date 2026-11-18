import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { firebaseConfigured } from './core/services/firebase';
import { Footer } from './shared/components/footer/footer';
import { Navbar } from './shared/components/navbar/navbar';
import { Toasts } from './shared/components/toasts/toasts';

/** Componente raíz: layout general (navbar + contenido enrutado + footer). */
@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Navbar, Footer, Toasts],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  protected readonly firebaseConfigured = firebaseConfigured;
}
