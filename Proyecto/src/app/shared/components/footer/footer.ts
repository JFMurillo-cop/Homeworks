import { Component } from '@angular/core';

@Component({
  selector: 'app-footer',
  template: `
    <footer>
      <div class="container">
        <span>🛍️ CampusMarket</span>
      </div>
    </footer>
  `,
  styles: `
    /* padding-bottom deja espacio para la insignia flotante de Netlify (esquina inferior derecha). */
    footer { background: var(--surface); border-top: 1px solid var(--border); padding: 1.5rem 0 4.5rem; margin-top: 2rem; }
    .container { display: flex; justify-content: space-between; gap: 1rem; flex-wrap: wrap; }
  `,
})
export class Footer {}
