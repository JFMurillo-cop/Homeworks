import { Component, computed, inject, model, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ProductService } from '../../../core/services/product.service';

/**
 * Buscador con autocompletado. Las sugerencias salen del Trie del ProductService.
 * Usa `model()` para tener binding bidireccional con el padre: [(query)].
 */
@Component({
  selector: 'app-search-box',
  imports: [FormsModule],
  template: `
    <div class="search">
      <span class="icon">🔍</span>
      <input
        type="search"
        placeholder="Buscar productos… (ej. café, usb, buzo)"
        [ngModel]="query()"
        (ngModelChange)="query.set($event); open.set(true)"
        (focus)="open.set(true)"
        (blur)="close()"
        (keydown.escape)="open.set(false)"
        aria-label="Buscar productos"
      />
      @if (open() && suggestions().length) {
        <ul class="suggestions">
          @for (s of suggestions(); track s) {
            <li (mousedown)="pick(s)">{{ s }}</li>
          }
        </ul>
      }
    </div>
  `,
  styles: `
    .search { position: relative; }
    .icon { position: absolute; left: 0.9rem; top: 50%; transform: translateY(-50%); }
    input {
      width: 100%; font: inherit; padding: 0.8rem 1rem 0.8rem 2.6rem;
      border: 1px solid var(--border); border-radius: 12px; background: var(--surface);
      &:focus { outline: 2px solid var(--primary-soft); border-color: var(--primary); }
    }
    .suggestions {
      position: absolute; z-index: 5; left: 0; right: 0; top: calc(100% + 4px);
      list-style: none; margin: 0; padding: 0.3rem;
      background: var(--surface); border: 1px solid var(--border); border-radius: 12px; box-shadow: var(--shadow-hover);
      li { padding: 0.5rem 0.8rem; border-radius: 8px; cursor: pointer; &:hover { background: var(--primary-soft); } }
    }
  `,
})
export class SearchBox {
  private readonly products = inject(ProductService);
  readonly query = model('');
  protected readonly open = signal(false);
  protected readonly suggestions = computed(() => this.products.suggestions(this.query()));

  pick(word: string): void {
    const words = this.query().split(/\s+/);
    words[words.length - 1] = word;
    this.query.set(words.join(' '));
    this.open.set(false);
  }

  close(): void {
    setTimeout(() => this.open.set(false), 100);
  }
}
