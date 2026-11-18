import { Component, DestroyRef, computed, inject, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Queue } from '../../../core/data-structures/queue';
import { ChatThread, Order, OrderStatus } from '../../../core/models';
import { ChatService } from '../../../core/services/chat.service';
import { DeliveryService } from '../../../core/services/delivery.service';
import { ORDER_FLOW, OrderService } from '../../../core/services/order.service';
import { ProductService } from '../../../core/services/product.service';
import { ToastService } from '../../../core/services/toast.service';
import { CopPipe } from '../../../shared/pipes/cop.pipe';

@Component({
  selector: 'app-dashboard',
  imports: [DatePipe, RouterLink, CopPipe],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss',
})
export class Dashboard {
  protected readonly products = inject(ProductService);
  protected readonly delivery = inject(DeliveryService);
  private readonly orderService = inject(OrderService);
  private readonly toast = inject(ToastService);

  protected readonly flow = ORDER_FLOW;
  protected readonly orders = signal<Order[]>([]);
  protected readonly threads = signal<ChatThread[]>([]);
  protected readonly seeding = signal(false);

  /**
   * Cola FIFO de pedidos pendientes: se reconstruye en cada actualización en tiempo real
   * a partir de los pedidos ordenados por fecha. El primero en llegar es el primero en atenderse.
   */
  protected readonly pendingQueue = computed(() => {
    const queue = new Queue<Order>();
    this.orders()
      .filter((o) => o.status === 'pendiente')
      .forEach((o) => queue.enqueue(o));
    return queue;
  });

  protected readonly active = computed(() =>
    this.orders()
      .filter((o) => o.status !== 'pendiente' && o.status !== 'entregado')
      .reverse(),
  );

  protected readonly revenue = computed(() =>
    this.orders().reduce((sum, o) => sum + o.total, 0),
  );

  /** Ranking con el MaxHeap del ProductService. */
  protected readonly ranking = computed(() => {
    this.products.products();
    return this.products.topSellers(5);
  });

  constructor() {
    const destroyRef = inject(DestroyRef);
    destroyRef.onDestroy(this.orderService.listenAllOrders((o) => this.orders.set(o)));
    destroyRef.onDestroy(inject(ChatService).listenThreads((t) => this.threads.set(t)));
  }

  /** Atiende el siguiente pedido de la cola (dequeue) → pasa a "preparando". */
  async serveNext(): Promise<void> {
    const next = this.pendingQueue().peek();
    if (!next) return;
    await this.setStatus(next, 'preparando');
  }

  async advance(order: Order): Promise<void> {
    const i = ORDER_FLOW.indexOf(order.status);
    if (i < ORDER_FLOW.length - 1) await this.setStatus(order, ORDER_FLOW[i + 1]);
  }

  async seed(): Promise<void> {
    this.seeding.set(true);
    try {
      await this.products.seedCatalog();
      this.toast.show('Catálogo cargado en Firestore.');
    } catch (e) {
      this.toast.error('No se pudo cargar el catálogo. Revisa las reglas de Firestore.');
      console.error(e);
    } finally {
      this.seeding.set(false);
    }
  }

  private async setStatus(order: Order, status: OrderStatus): Promise<void> {
    try {
      await this.orderService.updateStatus(order.id, status);
      this.toast.show(`Pedido #${order.id.slice(0, 6).toUpperCase()} → ${status}`);
    } catch (e) {
      this.toast.error('No se pudo actualizar el pedido.');
      console.error(e);
    }
  }
}
