/**
 * Generic Stack implementation (LIFO - Last In, First Out).
 * The only method that truly needs a custom implementation is `peek`;
 * the rest are straightforward wrappers around the underlying array.
 */
export class Stack<T> {
  private items: T[] = [];

  /** Adds a new value to the top of the stack. */
  push(value: T): void {
    this.items.push(value);
  }

  /** Removes and returns the last value added to the stack. */
  pop(): T | null {
    return this.items.length > 0 ? this.items.pop()! : null;
  }

  /** Returns the last value added to the stack, without removing it. */
  peek(): T | null {
    return this.items.length > 0 ? this.items[this.items.length - 1] : null;
  }

  /** Returns true if the stack has no elements. */
  isEmpty(): boolean {
    return this.items.length === 0;
  }

  /** Returns the number of elements currently in the stack. */
  size(): number {
    return this.items.length;
  }

  /** Returns the contents of the stack, from top to bottom, without mutating it. */
  print(): T[] {
    return [...this.items].reverse();
  }
}
