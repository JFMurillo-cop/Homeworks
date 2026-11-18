/**
 * Heap binario genérico (montículo) sobre un arreglo.
 * La función `compare(a, b)` devuelve < 0 si `a` debe salir antes que `b`.
 *  - MaxHeap: compare = (a, b) => b - a
 *  - MinHeap: compare = (a, b) => a - b
 *
 * Uso en el proyecto:
 *  - Ranking "Más vendidos" (MaxHeap por unidades vendidas) → ProductService.topSellers().
 *  - Cola de prioridad de Dijkstra (MinHeap por distancia) → Graph.dijkstra().
 * insert / extract O(log n), peek O(1).
 */
export class Heap<T> {
  private data: T[] = [];

  constructor(private readonly compare: (a: T, b: T) => number) {}

  static fromArray<T>(values: T[], compare: (a: T, b: T) => number): Heap<T> {
    const heap = new Heap<T>(compare);
    values.forEach((v) => heap.insert(v));
    return heap;
  }

  get size(): number {
    return this.data.length;
  }

  isEmpty(): boolean {
    return this.data.length === 0;
  }

  peek(): T | undefined {
    return this.data[0];
  }

  insert(value: T): void {
    this.data.push(value);
    this.siftUp(this.data.length - 1);
  }

  extract(): T | undefined {
    if (this.data.length === 0) return undefined;
    const top = this.data[0];
    const last = this.data.pop()!;
    if (this.data.length > 0) {
      this.data[0] = last;
      this.siftDown(0);
    }
    return top;
  }

  /** Extrae los k primeros sin destruir el heap original. O(k log n) */
  top(k: number): T[] {
    const copy = new Heap<T>(this.compare);
    copy.data = [...this.data];
    const result: T[] = [];
    while (result.length < k && !copy.isEmpty()) result.push(copy.extract()!);
    return result;
  }

  private siftUp(index: number): void {
    while (index > 0) {
      const parent = Math.floor((index - 1) / 2);
      if (this.compare(this.data[index], this.data[parent]) >= 0) break;
      this.swap(index, parent);
      index = parent;
    }
  }

  private siftDown(index: number): void {
    const n = this.data.length;
    while (true) {
      const left = 2 * index + 1;
      const right = left + 1;
      let best = index;
      if (left < n && this.compare(this.data[left], this.data[best]) < 0) best = left;
      if (right < n && this.compare(this.data[right], this.data[best]) < 0) best = right;
      if (best === index) return;
      this.swap(index, best);
      index = best;
    }
  }

  private swap(i: number, j: number): void {
    [this.data[i], this.data[j]] = [this.data[j], this.data[i]];
  }
}
