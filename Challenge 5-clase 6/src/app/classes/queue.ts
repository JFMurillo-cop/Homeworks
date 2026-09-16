/**
 * Generic Queue implementation (FIFO - First In, First Out).
 * The only method that truly needs a custom implementation is `peek`;
 * the rest are straightforward wrappers around the underlying array.
 */
export class Queue<T> {
  private items: T[] = [];

  /** Adds a new element to the end of the queue. */
  enqueue(item: T): void {
    this.items.push(item);
  }

  /** Removes and returns the first element of the queue. */
  dequeue(): T | null {
    return this.items.length > 0 ? this.items.shift()! : null;
  }

  /** Returns the first element of the queue, without removing it. */
  peek(): T | null {
    return this.items.length > 0 ? this.items[0] : null;
  }

  /** Returns the number of elements currently in the queue. */
  size(): number {
    return this.items.length;
  }

  /** Returns true if the queue has no elements. */
  isEmpty(): boolean {
    return this.items.length === 0;
  }

  /** Returns the contents of the queue, from front to back, without mutating it. */
  print(): T[] {
    return [...this.items];
  }
}
