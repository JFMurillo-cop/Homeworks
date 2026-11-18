import { Component, computed, inject, input, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { injectAddToCart } from '../../../core/services/add-to-cart';
import { ProductService } from '../../../core/services/product.service';
import { CopPipe } from '../../../shared/pipes/cop.pipe';

@Component({
  selector: 'app-product-detail',
  imports: [RouterLink, CopPipe],
  template: `
    <div class="container page">
      <a routerLink="/catalogo">← Volver al catálogo</a>
      @if (product(); as p) {
        <div class="detail card">
          <div class="thumb">{{ p.emoji }}</div>
          <div>
            <span class="muted">{{ p.category }}</span>
            <h1>{{ p.name }}</h1>
            <p>{{ p.description }}</p>
            <p class="price">{{ p.price | cop }}</p>
            <p class="muted">{{ p.stock }} disponibles · {{ p.sold }} vendidos</p>
            <div class="buy">
              <div class="qty">
                <button class="btn secondary small" (click)="qty.set(qty() - 1)" [disabled]="qty() <= 1">−</button>
                <span>{{ qty() }}</span>
                <button class="btn secondary small" (click)="qty.set(qty() + 1)" [disabled]="qty() >= p.stock">+</button>
              </div>
              <button class="btn" [disabled]="p.stock === 0" (click)="addToCart(p, qty())">Agregar al carrito</button>
            </div>
          </div>
        </div>
      } @else {
        <div class="empty"><div class="icon">🤷</div><p>Producto no encontrado.</p></div>
      }
    </div>
  `,
  styles: `
    .detail { display: grid; grid-template-columns: 1fr 1.2fr; gap: 2rem; margin-top: 1rem; }
    .thumb { display: grid; place-items: center; font-size: 8rem; min-height: 300px; border-radius: 12px; background: linear-gradient(135deg, var(--primary-soft), #fff6e5); }
    .price { font-size: 2rem; font-weight: 800; color: var(--primary); margin: 0.5rem 0; }
    .buy { display: flex; gap: 1rem; align-items: center; margin-top: 1.5rem; flex-wrap: wrap; }
    .qty { display: flex; align-items: center; gap: 0.75rem; font-weight: 700; }
    @media (max-width: 700px) { .detail { grid-template-columns: 1fr; } }
  `,
})
export class ProductDetail {
  private readonly products = inject(ProductService);
  protected readonly addToCart = injectAddToCart();
  /** Parámetro de ruta :id enlazado como input. */
  readonly id = input.required<string>();
  protected readonly qty = signal(1);
  protected readonly product = computed(() => {
    this.products.products();
    return this.products.getById(this.id());
  });
}
