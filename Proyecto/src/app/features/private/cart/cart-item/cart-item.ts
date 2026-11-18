import { Component, input, output } from '@angular/core';
import { CartItem } from '../../../../core/models';
import { CopPipe } from '../../../../shared/pipes/cop.pipe';

/** Hijo del carrito: una fila con controles de cantidad. */
@Component({
  selector: 'app-cart-item',
  imports: [CopPipe],
  template: `
    <div class="row">
      <span class="emoji">{{ item().emoji }}</span>
      <div class="info">
        <strong>{{ item().name }}</strong>
        <span class="muted">{{ item().price | cop }} c/u</span>
      </div>
      <div class="qty">
        <button class="btn secondary small" (click)="quantityChange.emit(item().quantity - 1)">−</button>
        <span>{{ item().quantity }}</span>
        <button class="btn secondary small" (click)="quantityChange.emit(item().quantity + 1)">+</button>
      </div>
      <strong class="total">{{ item().price * item().quantity | cop }}</strong>
      <button class="btn ghost small" (click)="remove.emit()" aria-label="Quitar">✕</button>
    </div>
  `,
  styles: `
    .row { display: grid; grid-template-columns: 3rem 1fr auto 7rem auto; align-items: center; gap: 1rem; padding: 0.9rem 0; border-bottom: 1px solid var(--border); }
    .emoji { font-size: 2rem; text-align: center; }
    .info { display: flex; flex-direction: column; }
    .qty { display: flex; align-items: center; gap: 0.5rem; font-weight: 700; }
    .total { text-align: right; }
    @media (max-width: 600px) { .row { grid-template-columns: 2.5rem 1fr auto; } .total { grid-column: 2; text-align: left; } }
  `,
})
export class CartItemRow {
  readonly item = input.required<CartItem>();
  readonly quantityChange = output<number>();
  readonly remove = output<void>();
}
