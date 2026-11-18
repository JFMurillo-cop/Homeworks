/**
 * Cola (FIFO) implementada con nodos enlazados para que enqueue y dequeue sean O(1).
 * Uso en el proyecto: cola de pedidos pendientes que el administrador atiende
 * en orden de llegada (AdminDashboard / OrderService).
 */
class QueueNode<T> {
  next: QueueNode<T> | null = null;
  constructor(public value: T) {}
}

export class Queue<T> implements Iterable<T> {
  private front: QueueNode<T> | null = null;
  private rear: QueueNode<T> | null = null;
  private length = 0;

  get size(): number {
    return this.length;
  }

  isEmpty(): boolean {
    return this.length === 0;
  }

  enqueue(value: T): void {
    const node = new QueueNode(value);
    if (this.rear) this.rear.next = node;
    else this.front = node;
    this.rear = node;
    this.length++;
  }

  dequeue(): T | undefined {
    if (!this.front) return undefined;
    const value = this.front.value;
    this.front = this.front.next;
    if (!this.front) this.rear = null;
    this.length--;
    return value;
  }

  peek(): T | undefined {
    return this.front?.value;
  }

  clear(): void {
    this.front = this.rear = null;
    this.length = 0;
  }

  toArray(): T[] {
    return [...this];
  }

  *[Symbol.iterator](): Iterator<T> {
    let current = this.front;
    while (current) {
      yield current.value;
      current = current.next;
    }
  }
}
