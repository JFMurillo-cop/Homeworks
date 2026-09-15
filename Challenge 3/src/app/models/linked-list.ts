// Nodo de una lista enlazada simple
export class ListNode<T> {
  value: T;
  next: ListNode<T> | null = null;

  constructor(value: T) {
    this.value = value;
  }
}

/**
 * Lista enlazada simple genérica.
 * Se usa para reproducir canciones en orden (solo hacia adelante).
 */
export class LinkedList<T> {
  private head: ListNode<T> | null = null;
  private tail: ListNode<T> | null = null;
  private current: ListNode<T> | null = null;
  private _length = 0;

  get length(): number {
    return this._length;
  }

  /** Agrega un elemento al final de la lista */
  append(value: T): void {
    const node = new ListNode(value);
    if (!this.head) {
      this.head = node;
      this.tail = node;
      this.current = node;
    } else {
      this.tail!.next = node;
      this.tail = node;
    }
    this._length++;
  }

  /** Elemento actualmente "en reproducción" */
  getCurrent(): T | null {
    return this.current ? this.current.value : null;
  }

  /** Avanza al siguiente nodo y lo retorna (o null si no hay siguiente) */
  next(): T | null {
    if (this.current && this.current.next) {
      this.current = this.current.next;
      return this.current.value;
    }
    return null;
  }

  /** Indica si hay un siguiente elemento disponible */
  hasNext(): boolean {
    return !!this.current?.next;
  }

  /** Reinicia la reproducción al primer elemento */
  reset(): void {
    this.current = this.head;
  }

  /** Devuelve todos los valores en orden, marcando cuál es el actual */
  toArray(): { value: T; isCurrent: boolean }[] {
    const result: { value: T; isCurrent: boolean }[] = [];
    let node = this.head;
    while (node) {
      result.push({ value: node.value, isCurrent: node === this.current });
      node = node.next;
    }
    return result;
  }
}
