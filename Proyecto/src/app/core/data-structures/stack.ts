/**
 * Pila (LIFO).
 * Uso en el proyecto: historial de acciones del carrito para "Deshacer" (CartService).
 * push/pop/peek O(1).
 */
export class Stack<T> {
  private items: T[] = [];

  constructor(private readonly maxSize = Infinity) {}

  get size(): number {
    return this.items.length;
  }

  isEmpty(): boolean {
    return this.items.length === 0;
  }

  push(item: T): void {
    this.items.push(item);
    // Si se supera el máximo, se descarta la acción más antigua (base de la pila).
    if (this.items.length > this.maxSize) this.items.shift();
  }

  pop(): T | undefined {
    return this.items.pop();
  }

  peek(): T | undefined {
    return this.items[this.items.length - 1];
  }

  clear(): void {
    this.items = [];
  }

  toArray(): T[] {
    return [...this.items];
  }
}
