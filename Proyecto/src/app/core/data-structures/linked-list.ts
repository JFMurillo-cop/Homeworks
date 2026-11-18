/**
 * Lista simplemente enlazada genérica.
 * Uso en el proyecto: almacena los ítems del carrito de compras (CartService).
 * Inserción al final O(1) gracias al puntero `tail`; búsqueda y borrado O(n).
 */
class ListNode<T> {
  constructor(
    public value: T,
    public next: ListNode<T> | null = null,
  ) {}
}

export class LinkedList<T> implements Iterable<T> {
  private head: ListNode<T> | null = null;
  private tail: ListNode<T> | null = null;
  private length = 0;

  get size(): number {
    return this.length;
  }

  isEmpty(): boolean {
    return this.length === 0;
  }

  /** Agrega al final. O(1) */
  append(value: T): void {
    const node = new ListNode(value);
    if (!this.tail) {
      this.head = this.tail = node;
    } else {
      this.tail.next = node;
      this.tail = node;
    }
    this.length++;
  }

  /** Agrega al inicio. O(1) */
  prepend(value: T): void {
    const node = new ListNode(value, this.head);
    this.head = node;
    if (!this.tail) this.tail = node;
    this.length++;
  }

  /** Inserta en una posición dada (0..size). O(n) */
  insertAt(index: number, value: T): void {
    if (index <= 0) return this.prepend(value);
    if (index >= this.length) return this.append(value);
    let prev = this.head!;
    for (let i = 0; i < index - 1; i++) prev = prev.next!;
    prev.next = new ListNode(value, prev.next);
    this.length++;
  }

  /** Primer elemento que cumple el predicado. O(n) */
  find(predicate: (value: T) => boolean): T | undefined {
    for (const value of this) if (predicate(value)) return value;
    return undefined;
  }

  indexOf(predicate: (value: T) => boolean): number {
    let i = 0;
    for (const value of this) {
      if (predicate(value)) return i;
      i++;
    }
    return -1;
  }

  /** Elimina el primer elemento que cumple el predicado y lo devuelve. O(n) */
  remove(predicate: (value: T) => boolean): T | undefined {
    let prev: ListNode<T> | null = null;
    let current = this.head;
    while (current) {
      if (predicate(current.value)) {
        if (prev) prev.next = current.next;
        else this.head = current.next;
        if (current === this.tail) this.tail = prev;
        this.length--;
        return current.value;
      }
      prev = current;
      current = current.next;
    }
    return undefined;
  }

  clear(): void {
    this.head = this.tail = null;
    this.length = 0;
  }

  toArray(): T[] {
    return [...this];
  }

  static fromArray<T>(values: T[]): LinkedList<T> {
    const list = new LinkedList<T>();
    values.forEach((v) => list.append(v));
    return list;
  }

  *[Symbol.iterator](): Iterator<T> {
    let current = this.head;
    while (current) {
      yield current.value;
      current = current.next;
    }
  }
}
