import { Heap } from './heap';

/**
 * Grafo no dirigido y ponderado con lista de adyacencia.
 * Uso en el proyecto: mapa de puntos de entrega del campus. Cada vértice es un
 * edificio y cada arista un camino con su distancia en metros. Con Dijkstra se
 * calcula la ruta más corta desde la tienda hasta el punto de entrega elegido,
 * y con ella el costo y el tiempo estimado del domicilio.
 */
export interface Edge {
  to: string;
  weight: number;
}

export interface PathResult {
  path: string[];
  distance: number;
}

export class Graph {
  private adjacency = new Map<string, Edge[]>();

  get vertexCount(): number {
    return this.adjacency.size;
  }

  addVertex(id: string): void {
    if (!this.adjacency.has(id)) this.adjacency.set(id, []);
  }

  addEdge(a: string, b: string, weight: number): void {
    if (weight < 0) throw new Error('Dijkstra no admite pesos negativos');
    this.addVertex(a);
    this.addVertex(b);
    this.adjacency.get(a)!.push({ to: b, weight });
    this.adjacency.get(b)!.push({ to: a, weight });
  }

  hasVertex(id: string): boolean {
    return this.adjacency.has(id);
  }

  neighbors(id: string): Edge[] {
    return this.adjacency.get(id) ?? [];
  }

  vertices(): string[] {
    return [...this.adjacency.keys()];
  }

  /** Recorrido en anchura: vértices alcanzables desde `start`. */
  bfs(start: string): string[] {
    if (!this.hasVertex(start)) return [];
    const visited = new Set<string>([start]);
    const order: string[] = [];
    const queue: string[] = [start];
    while (queue.length) {
      const current = queue.shift()!;
      order.push(current);
      for (const { to } of this.neighbors(current)) {
        if (!visited.has(to)) {
          visited.add(to);
          queue.push(to);
        }
      }
    }
    return order;
  }

  /**
   * Camino más corto (Dijkstra con MinHeap). O((V + E) log V).
   * Devuelve null si no existe camino.
   */
  shortestPath(start: string, end: string): PathResult | null {
    if (!this.hasVertex(start) || !this.hasVertex(end)) return null;

    const dist = new Map<string, number>();
    const prev = new Map<string, string | null>();
    this.vertices().forEach((v) => {
      dist.set(v, Infinity);
      prev.set(v, null);
    });
    dist.set(start, 0);

    const heap = new Heap<[string, number]>((a, b) => a[1] - b[1]);
    heap.insert([start, 0]);

    while (!heap.isEmpty()) {
      const [current, d] = heap.extract()!;
      if (d > dist.get(current)!) continue; // entrada obsoleta
      if (current === end) break;
      for (const { to, weight } of this.neighbors(current)) {
        const candidate = d + weight;
        if (candidate < dist.get(to)!) {
          dist.set(to, candidate);
          prev.set(to, current);
          heap.insert([to, candidate]);
        }
      }
    }

    const distance = dist.get(end)!;
    if (distance === Infinity) return null;

    const path: string[] = [];
    for (let at: string | null = end; at !== null; at = prev.get(at)!) path.unshift(at);
    return { path, distance };
  }
}
