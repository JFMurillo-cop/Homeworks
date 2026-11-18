import { Component, DestroyRef, inject, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Order } from '../../../core/models';
import { AuthService } from '../../../core/services/auth.service';
import { DeliveryService } from '../../../core/services/delivery.service';
import { ORDER_FLOW, OrderService } from '../../../core/services/order.service';
import { CopPipe } from '../../../shared/pipes/cop.pipe';

@Component({
  selector: 'app-orders',
  imports: [DatePipe, RouterLink, CopPipe],
  template: `
    <div class="container page">
      <h1>📦 Mis pedidos</h1>
      <p class="muted">El estado se actualiza en tiempo real.</p>

      @if (loading()) {
        <p class="muted">Cargando…</p>
      } @else {
        @for (o of orders(); track o.id) {
          <article class="card order">
            <header>
              <div>
                <strong>Pedido #{{ o.id.slice(0, 6).toUpperCase() }}</strong>
                <span class="muted"> · {{ o.createdAt | date: 'medium' }}</span>
              </div>
              <span class="badge" [class]="o.status.replace(' ', '-')">{{ o.status }}</span>
            </header>
            <ol class="steps">
              @for (s of flow; track s; let i = $index) {
                <li [class.done]="i <= flow.indexOf(o.status)">{{ s }}</li>
              }
            </ol>
            <p>
              @for (i of o.items; track i.productId; let last = $last) {
                {{ i.emoji }} {{ i.name }} × {{ i.quantity }}{{ last ? '' : ', ' }}
              }
            </p>
            <p class="muted">📍 {{ delivery.label(o.deliveryPoint) }} · {{ o.distance }} m</p>
            <p><strong>Total: {{ o.total | cop }}</strong></p>
          </article>
        } @empty {
          <div class="empty card">
            <div class="icon">📦</div>
            <p>Aún no tienes pedidos.</p>
            <a routerLink="/catalogo" class="btn">Hacer mi primer pedido</a>
          </div>
        }
      }
    </div>
  `,
  styles: `
    .order { margin-bottom: 1rem; }
    header { display: flex; justify-content: space-between; align-items: center; gap: 1rem; flex-wrap: wrap; }
    .steps { display: flex; list-style: none; padding: 0; margin: 1rem 0; gap: 0.25rem; }
    .steps li { flex: 1; text-align: center; font-size: 0.8rem; padding: 0.4rem; background: var(--bg); color: var(--muted); border-radius: 6px; text-transform: capitalize; }
    .steps li.done { background: var(--primary); color: #fff; }
    p { margin: 0.4rem 0; }
  `,
})
export class Orders {
  protected readonly delivery = inject(DeliveryService);
  protected readonly flow = ORDER_FLOW;
  protected readonly orders = signal<Order[]>([]);
  protected readonly loading = signal(true);

  constructor() {
    const uid = inject(AuthService).user()!.uid;
    const unsubscribe = inject(OrderService).listenUserOrders(uid, (orders) => {
      this.orders.set(orders);
      this.loading.set(false);
    });
    inject(DestroyRef).onDestroy(unsubscribe);
  }
}
