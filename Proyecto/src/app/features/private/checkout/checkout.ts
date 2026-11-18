import { Component, computed, inject, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { CartService } from '../../../core/services/cart.service';
import { DeliveryService } from '../../../core/services/delivery.service';
import { OrderService } from '../../../core/services/order.service';
import { ProductService } from '../../../core/services/product.service';
import { ToastService } from '../../../core/services/toast.service';
import { CampusMap } from '../../../shared/components/campus-map/campus-map';
import { CopPipe } from '../../../shared/pipes/cop.pipe';

@Component({
  selector: 'app-checkout',
  imports: [RouterLink, CampusMap, CopPipe],
  templateUrl: './checkout.html',
  styles: `
    .layout { display: grid; grid-template-columns: 1.6fr 1fr; gap: 1rem; align-items: start; }
    .map { padding: 0.5rem; }
    select { width: 100%; font: inherit; padding: 0.6rem; border: 1px solid var(--border); border-radius: 10px; margin-bottom: 1rem; }
    .line { display: flex; justify-content: space-between; gap: 1rem; margin: 0.35rem 0; }
    .total { font-size: 1.2rem; border-top: 1px solid var(--border); padding-top: 0.6rem; margin-top: 0.6rem; }
    .route { font-size: 0.85rem; }
    .full { width: 100%; margin-top: 1rem; }
    @media (max-width: 860px) { .layout { grid-template-columns: 1fr; } }
  `,
})
export class Checkout {
  protected readonly cart = inject(CartService);
  protected readonly delivery = inject(DeliveryService);
  private readonly auth = inject(AuthService);
  private readonly orders = inject(OrderService);
  private readonly products = inject(ProductService);
  private readonly toast = inject(ToastService);
  private readonly router = inject(Router);

  protected readonly deliverable = this.delivery.points.filter((p) => p.deliverable);
  protected readonly point = signal<string | null>(null);
  protected readonly placing = signal(false);
  protected readonly catalogNotLoaded = this.products.usingSeed;

  protected readonly quote = computed(() => {
    const id = this.point();
    return id ? this.delivery.quote(id) : null;
  });
  protected readonly total = computed(() => this.cart.subtotal() + (this.quote()?.fee ?? 0));
  protected readonly routeText = computed(() =>
    (this.quote()?.path ?? []).map((id) => this.delivery.label(id)).join(' → '),
  );

  async confirm(): Promise<void> {
    const user = this.auth.user();
    const quote = this.quote();
    if (!user || !quote || !this.cart.items().length) return;
    this.placing.set(true);
    try {
      await this.orders.placeOrder(user, this.cart.items(), quote);
      this.cart.clear(false);
      this.toast.show('✅ ¡Pedido realizado! Puedes seguirlo en tiempo real.');
      this.router.navigate(['/mis-pedidos']);
    } catch (e) {
      this.toast.error(e instanceof Error ? e.message : 'No se pudo crear el pedido.');
      console.error(e);
    } finally {
      this.placing.set(false);
    }
  }
}
