/**
 * Heap implementado desde cero, con los mismos métodos vistos en clase
 * (push, pop, peek, heapify, percolateUp, percolateDown, swap, size,
 * toArray), representado con un arreglo, igual que en la diapositiva
 * "How to represent a heap?" (hijos de i: 2i+1 y 2i+2).
 *
 * Es genérico y recibe un comparador: compare(a, b) < 0 significa
 * "a va antes que b" (más arriba en el heap). Así el mismo Heap<T>
 * sirve tanto de min-heap como de max-heap según qué comparador le pasemos.
 * Para este reto lo usamos como MAX-heap de popularidad (el más popular
 * primero), para resolver "Top K más populares".
 */
export class Heap<T> {
  private heap: T[] = [];

  constructor(private compare: (a: T, b: T) => number) {}

  /** Inserta un elemento, reordenando el heap con percolateUp. */
  push(value: T): void {
    this.heap.push(value);
    this.percolateUp();
  }

  /** Quita y devuelve el elemento "más alto" (según el comparador), reordenando con percolateDown. */
  pop(): T | undefined {
    if (this.heap.length === 0) return undefined;

    const n = this.heap.length;
    this.swap(0, n - 1);

    const top = this.heap.pop();
    this.percolateDown(0);

    return top;
  }

  /** Devuelve el elemento "más alto" sin quitarlo. */
  peek(): T | undefined {
    return this.heap[0];
  }

  /** Convierte un arreglo desordenado en un heap válido. */
  heapify(): void {
    const start = Math.floor((this.heap.length - 2) / 2);
    for (let i = start; i >= 0; i--) {
      this.percolateDown(i);
    }
  }

  percolateDown(index: number): void {
    let curr = index;

    while (2 * curr + 1 < this.heap.length) {
      const left = 2 * curr + 1;
      const right = 2 * curr + 2;

      const mejorHijo =
        right < this.heap.length && this.compare(this.heap[right], this.heap[left]) < 0
          ? right
          : left;

      if (this.compare(this.heap[mejorHijo], this.heap[curr]) < 0) {
        this.swap(curr, mejorHijo);
        curr = mejorHijo;
      } else {
        break;
      }
    }
  }

  percolateUp(): void {
    let curr = this.heap.length - 1;

    while (curr > 0) {
      const parent = Math.floor((curr - 1) / 2);

      if (this.compare(this.heap[curr], this.heap[parent]) < 0) {
        this.swap(curr, parent);
        curr = parent;
      } else {
        break;
      }
    }
  }

  swap(i: number, j: number): void {
    [this.heap[i], this.heap[j]] = [this.heap[j], this.heap[i]];
  }

  size(): number {
    return this.heap.length;
  }

  toArray(): T[] {
    return [...this.heap];
  }
}
