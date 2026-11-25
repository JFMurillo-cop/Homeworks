// ===============================================
// Recomendación de canciones: GRAFO NO DIRIGIDO
// ===============================================
// Representado con lista de adyacencia: Map<canción, Set<canciones>>.
// Al ser NO dirigido, cada arista se guarda en ambos sentidos:
// si A es similar a B, entonces B es similar a A.

export class Graph {
  constructor() {
    this.adj = new Map();
  }

  addVertex(song) {
    if (!this.adj.has(song)) this.adj.set(song, new Set());
  }

  // Conectar dos canciones similares (arista no dirigida)
  addEdge(a, b) {
    if (a === b) return;
    this.addVertex(a);
    this.addVertex(b);
    this.adj.get(a).add(b);
    this.adj.get(b).add(a);
  }

  removeEdge(a, b) {
    this.adj.get(a)?.delete(b);
    this.adj.get(b)?.delete(a);
  }

  hasVertex(song) {
    return this.adj.has(song);
  }

  // Recomendaciones directas: vecinos inmediatos
  neighbors(song) {
    return [...(this.adj.get(song) ?? [])];
  }

  // Recomendaciones por BFS hasta cierta profundidad.
  // Devuelve [{ title, distance }] ordenado de más a menos cercano.
  // distance 1 = similar directa, 2 = "similar de una similar", etc.
  recommend(song, maxDepth = 2) {
    if (!this.adj.has(song)) return [];

    const visited = new Set([song]);
    const queue = [[song, 0]];
    const result = [];

    while (queue.length) {
      const [current, dist] = queue.shift();
      if (dist === maxDepth) continue;
      for (const next of this.adj.get(current)) {
        if (!visited.has(next)) {
          visited.add(next);
          result.push({ title: next, distance: dist + 1 });
          queue.push([next, dist + 1]);
        }
      }
    }
    return result;
  }

  // DFS: recorrido completo desde una canción (útil para mostrar el grafo)
  dfs(start) {
    const visited = new Set();
    const order = [];
    const visit = (v) => {
      visited.add(v);
      order.push(v);
      for (const n of this.adj.get(v) ?? []) if (!visited.has(n)) visit(n);
    };
    if (this.adj.has(start)) visit(start);
    return order;
  }
}
