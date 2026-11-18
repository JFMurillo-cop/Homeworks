import { Injectable } from '@angular/core';
import {
  collection,
  doc,
  onSnapshot,
  orderBy,
  query,
  runTransaction,
  Unsubscribe,
  updateDoc,
  where,
} from 'firebase/firestore';
import { AppUser, CartItem, Order, OrderStatus, Product } from '../models';
import { DeliveryQuote } from './delivery.service';
import { firestore } from './firebase';

@Injectable({ providedIn: 'root' })
export class OrderService {
  /**
   * Crea el pedido dentro de una TRANSACCIÓN de Firestore:
   *  1. Lee el stock actual de cada producto.
   *  2. Si alguno no alcanza, aborta todo (no se descuenta nada).
   *  3. Descuenta stock, suma vendidos y crea el documento del pedido de forma atómica.
   */
  async placeOrder(user: AppUser, items: CartItem[], delivery: DeliveryQuote): Promise<string> {
    const db = firestore();
    const orderRef = doc(collection(db, 'orders'));

    await runTransaction(db, async (tx) => {
      const refs = items.map((i) => doc(db, 'products', i.productId));
      const snaps = await Promise.all(refs.map((r) => tx.get(r)));

      snaps.forEach((snap, idx) => {
        const item = items[idx];
        if (!snap.exists()) throw new Error(`El producto "${item.name}" ya no existe.`);
        const stock = (snap.data() as Product).stock;
        if (stock < item.quantity) {
          throw new Error(`Stock insuficiente de "${item.name}" (quedan ${stock}).`);
        }
      });

      snaps.forEach((snap, idx) => {
        const product = snap.data() as Product;
        const qty = items[idx].quantity;
        tx.update(refs[idx], { stock: product.stock - qty, sold: product.sold + qty });
      });

      const subtotal = items.reduce((s, i) => s + i.price * i.quantity, 0);
      const order: Omit<Order, 'id'> = {
        userId: user.uid,
        userName: user.name,
        items,
        subtotal,
        deliveryFee: delivery.fee,
        total: subtotal + delivery.fee,
        deliveryPoint: delivery.pointId,
        route: delivery.path,
        distance: delivery.distance,
        status: 'pendiente',
        createdAt: Date.now(),
      };
      tx.set(orderRef, order);
    });

    return orderRef.id;
  }

  /** Pedidos del usuario en tiempo real (ordenados en el cliente para no requerir índice compuesto). */
  listenUserOrders(uid: string, cb: (orders: Order[]) => void): Unsubscribe {
    const q = query(collection(firestore(), 'orders'), where('userId', '==', uid));
    return onSnapshot(q, (snap) =>
      cb(snap.docs.map(toOrder).sort((a, b) => b.createdAt - a.createdAt)),
    );
  }

  /** Todos los pedidos (admin), del más antiguo al más reciente. */
  listenAllOrders(cb: (orders: Order[]) => void): Unsubscribe {
    const q = query(collection(firestore(), 'orders'), orderBy('createdAt', 'asc'));
    return onSnapshot(q, (snap) => cb(snap.docs.map(toOrder)));
  }

  updateStatus(orderId: string, status: OrderStatus): Promise<void> {
    return updateDoc(doc(firestore(), 'orders', orderId), { status });
  }
}

function toOrder(d: { id: string; data: () => unknown }): Order {
  return { ...(d.data() as Order), id: d.id };
}

export const ORDER_FLOW: OrderStatus[] = ['pendiente', 'preparando', 'en camino', 'entregado'];
