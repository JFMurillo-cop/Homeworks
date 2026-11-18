import { Component, input, output } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Product } from '../../../core/models';
import { CopPipe } from '../../pipes/cop.pipe';

/** Componente hijo: recibe un producto (input) y emite cuando se agrega al carrito (output). */
@Component({
  selector: 'app-product-card',
  imports: [RouterLink, CopPipe],
  template: `
    <article class="card product">
      <a [routerLink]="['/producto', product().id]" class="thumb">{{ product().emoji }}</a>
      @if (rank()) {
        <span class="rank">#{{ rank() }}</span>
      }
      <span class="category">{{ product().category }}</span>
      <a [routerLink]="['/producto', product().id]" class="name">{{ product().name }}</a>
      <div class="meta">
        <strong>{{ product().price | cop }}</strong>
        <span class="muted">{{ product().sold }} vendidos</span>
      </div>
      <button class="btn" [disabled]="product().stock === 0" (click)="add.emit(product())">
        {{ product().stock === 0 ? 'Agotado' : 'Agregar al carrito' }}
      </button>
    </article>
  `,
  styles: `
    .product {
      position: relative;
      display: flex;
      flex-direction: column;
      gap: 0.4rem;
      transition: box-shadow 0.15s, transform 0.15s;
      &:hover { box-shadow: var(--shadow-hover); transform: translateY(-2px); }
    }
    .thumb {
      display: grid;
      place-items: center;
      height: 130px;
      font-size: 4rem;
      border-radius: 10px;
      background: linear-gradient(135deg, var(--primary-soft), #fff6e5);
      margin-bottom: 0.4rem;
    }
    .rank {
      position: absolute; top: 0.8rem; left: 0.8rem;
      background: var(--primary); color: #fff; font-weight: 700;
      border-radius: 999px; padding: 0.1rem 0.6rem; font-size: 0.85rem;
    }
    .category { font-size: 0.78rem; color: var(--muted); text-transform: uppercase; letter-spacing: 0.04em; }
    .name { color: var(--text); font-weight: 600; }
    .meta { display: flex; justify-content: space-between; align-items: baseline; margin-bottom: 0.4rem; font-size: 0.9rem; }
    .btn { margin-top: auto; }
  `,
})
export class ProductCard {
  readonly product = input.required<Product>();
  readonly rank = input<number>();
  readonly add = output<Product>();
}
