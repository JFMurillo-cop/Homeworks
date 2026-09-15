// Nodo de una lista doblemente enlazada
export class DoublyListNode<T> {
  value: T;
  next: DoublyListNode<T> | null = null;
  prev: DoublyListNode<T> | null = null;

  constructor(value: T) {
    this.value = value;
  }
}

/**
 * Lista doblemente enlazada genérica.
 * Se usa para simular el historial de un navegador,
 * permitiendo moverse hacia atrás y hacia adelante entre páginas visitadas.
 */
export class DoublyLinkedList<T> {
  private head: DoublyListNode<T> | null = null;
  private tail: DoublyListNode<T> | null = null;
  private current: DoublyListNode<T> | null = null;
  private _length = 0;

  get length(): number {
    return this._length;
  }

  /** Agrega un elemento al final de la lista (carga inicial de datos falsos) */
  append(value: T): void {
    const node = new DoublyListNode(value);
    if (!this.head) {
      this.head = node;
      this.tail = node;
      this.current = node;
    } else {
      node.prev = this.tail;
      this.tail!.next = node;
      this.tail = node;
    }
    this._length++;
  }

  /**
   * Simula "visitar una nueva página": la agrega después del nodo actual
   * y descarta cualquier historial de "adelante" que hubiera quedado,
   * igual que hace un navegador real.
   */
  visit(value: T): void {
    const node = new DoublyListNode(value);
    if (!this.current) {
      this.head = node;
      this.tail = node;
      this.current = node;
      this._length = 1;
      return;
    }

    node.prev = this.current;
    this.current.next = node;
    this.current = node;
    this.tail = node;
    this._length++;
  }

  getCurrent(): T | null {
    return this.current ? this.current.value : null;
  }

  hasBack(): boolean {
    return !!this.current?.prev;
  }

  hasForward(): boolean {
    return !!this.current?.next;
  }

  back(): T | null {
    if (this.current?.prev) {
      this.current = this.current.prev;
      return this.current.value;
    }
    return null;
  }

  forward(): T | null {
    if (this.current?.next) {
      this.current = this.current.next;
      return this.current.value;
    }
    return null;
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
