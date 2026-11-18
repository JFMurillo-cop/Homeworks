import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CartService } from '../../../core/services/cart.service';
import { CopPipe } from '../../../shared/pipes/cop.pipe';
import { CartItemRow } from './cart-item/cart-item';

@Component({
  selector: 'app-cart',
  imports: [RouterLink, CopPipe, CartItemRow],
  template: `
    <div class="container page">
      <div class="section-title">
        <h1>🛒 Tu carrito</h1>
        <button class="btn secondary small" [disabled]="!cart.canUndo()" (click)="cart.undo()" title="Deshacer última acción (pila)">
          ↶ Deshacer
        </button>
      </div>

      @if (cart.items().length) {
        <div class="layout">
          <div class="card">
            @for (item of cart.items(); track item.productId) {
              <app-cart-item
                [item]="item"
                (quantityChange)="cart.setQuantity(item.productId, $event)"
                (remove)="cart.remove(item.productId)"
              />
            }
            <button class="btn ghost small clear" (click)="cart.clear()">Vaciar carrito</button>
          </div>
          <aside class="card summary">
            <h3>Resumen</h3>
            <p><span>Productos ({{ cart.count() }})</span><strong>{{ cart.subtotal() | cop }}</strong></p>
            <p class="muted"><span>Domicilio</span><span>Se calcula en el siguiente paso</span></p>
            <a routerLink="/checkout" class="btn full">Continuar con la entrega</a>
          </aside>
        </div>
      } @else {
        <div class="empty card">
          <div class="icon">🛒</div>
          <p>Tu carrito está vacío.</p>
          <a routerLink="/catalogo" class="btn">Ir al catálogo</a>
        </div>
      }
    </div>
  `,
  styles: `
    .layout { display: grid; grid-template-columns: 2fr 1fr; gap: 1rem; align-items: start; }
    .clear { margin-top: 0.75rem; }
    .summary p { display: flex; justify-content: space-between; gap: 1rem; }
    .full { width: 100%; }
    @media (max-width: 800px) { .layout { grid-template-columns: 1fr; } }
  `,
})
export class Cart {
  protected readonly cart = inject(CartService);
}
