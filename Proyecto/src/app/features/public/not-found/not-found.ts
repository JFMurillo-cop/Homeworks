import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-not-found',
  imports: [RouterLink],
  template: `
    <div class="container page empty">
      <div class="icon">🧭</div>
      <h1>Página no encontrada</h1>
      <p>La ruta que buscas no existe.</p>
      <a routerLink="/" class="btn">Volver al inicio</a>
    </div>
  `,
})
export class NotFound {}
