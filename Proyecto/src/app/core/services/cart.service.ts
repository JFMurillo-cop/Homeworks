import { Injectable, computed, signal } from '@angular/core';
import { LinkedList } from '../data-structures/linked-list';
import { Stack } from '../data-structures/stack';
import { CartItem, Product } from '../models';

const STORAGE_KEY = 'campusmarket.cart';

/**
 * Carrito de compras.
 *  - Los ítems viven en una LinkedList (inserción al final O(1), se recorren en orden de agregado).
 *  - Cada modificación guarda una copia del estado anterior en una Stack → "Deshacer" (LIFO).
 */
@Injectable({ providedIn: 'root' })
export class CartService {
  private list = new LinkedList<CartItem>();
  private history = new Stack<CartItem[]>(20);

  /** Copia inmutable de la lista para que la vista reaccione con signals. */
  private readonly _items = signal<CartItem[]>([]);
  readonly items = this._items.asReadonly();
  readonly canUndo = signal(false);

  readonly count = computed(() => this._items().reduce((n, i) => n + i.quantity, 0));
  readonly subtotal = computed(() => this._items().reduce((s, i) => s + i.price * i.quantity, 0));

  constructor() {
    try {
      const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '[]') as CartItem[];
      this.list = LinkedList.fromArray(saved);
    } catch {
      this.list = new LinkedList();
    }
    this.sync();
  }

  add(product: Product, quantity = 1): void {
    this.saveHistory();
    const existing = this.list.find((i) => i.productId === product.id);
    if (existing) {
      existing.quantity += quantity;
    } else {
      this.list.append({
        productId: product.id,
        name: product.name,
        emoji: product.emoji,
        price: product.price,
        quantity,
      });
    }
    this.sync();
  }

  setQuantity(productId: string, quantity: number): void {
    if (quantity <= 0) return this.remove(productId);
    const item = this.list.find((i) => i.productId === productId);
    if (!item || item.quantity === quantity) return;
    this.saveHistory();
    item.quantity = quantity;
    this.sync();
  }

  remove(productId: string): void {
    if (!this.list.find((i) => i.productId === productId)) return;
    this.saveHistory();
    this.list.remove((i) => i.productId === productId);
    this.sync();
  }

  clear(keepHistory = true): void {
    if (this.list.isEmpty()) return;
    if (keepHistory) this.saveHistory();
    else this.history.clear();
    this.list.clear();
    this.sync();
  }

  /** Restaura el estado previo a la última acción (pop de la pila). */
  undo(): void {
    const previous = this.history.pop();
    if (!previous) return;
    this.list = LinkedList.fromArray(previous);
    this.sync();
  }

  private saveHistory(): void {
    this.history.push(this.list.toArray().map((i) => ({ ...i })));
  }

  private sync(): void {
    const items = this.list.toArray().map((i) => ({ ...i }));
    this._items.set(items);
    this.canUndo.set(!this.history.isEmpty());
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }
}
