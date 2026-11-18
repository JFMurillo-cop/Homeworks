import { Component } from '@angular/core';

@Component({
  selector: 'app-footer',
  template: `
    <footer>
      <div class="container">
        <span>🛍️ CampusMarket</span>
        <span class="muted">© {{ year }}</span>
      </div>
    </footer>
  `,
  styles: `
    footer { background: var(--surface); border-top: 1px solid var(--border); padding: 1.5rem 0; margin-top: 2rem; }
    .container { display: flex; justify-content: space-between; gap: 1rem; flex-wrap: wrap; }
  `,
})
export class Footer {
  protected readonly year = new Date().getFullYear();
}
