/**
 * Grafo NO dirigido, implementado desde cero (sin librerías de grafos).
 * Guarda los nodos en una lista y las conexiones en un objeto/lista de
 * adyacencia, tal como se vio en clase (Graph -> nodes[] + adjList{}).
 *
 * T es el tipo del dato que guarda cada nodo (en este reto: una persona
 * o una ciudad, ver models/person-city.ts).
 */
export interface GraphNode<T> {
  id: string;
  data: T;
}

export class Graph<T> {
  private nodes: GraphNode<T>[] = [];
  private adjList: Record<string, string[]> = {};

  /** Agrega un nodo nuevo al grafo (si no existía ya). */
  addNode(id: string, data: T): GraphNode<T> {
    const existente = this.searchNode(id);
    if (existente) return existente;

    const node: GraphNode<T> = { id, data };
    this.nodes.push(node);
    this.adjList[id] = [];
    return node;
  }

  /** Conecta dos nodos entre sí (arista no dirigida: va en ambos sentidos). */
  addEdge(id1: string, id2: string): void {
    if (!this.searchNode(id1) || !this.searchNode(id2)) {
      throw new Error('No se puede conectar: alguno de los nodos no existe.');
    }
    if (!this.adjList[id1].includes(id2)) {
      this.adjList[id1].push(id2);
    }
    if (!this.adjList[id2].includes(id1)) {
      this.adjList[id2].push(id1);
    }
  }

  /** Busca y devuelve un nodo por su id (o undefined si no existe). */
  searchNode(id: string): GraphNode<T> | undefined {
    if (!this.nodes.length) return undefined;
    return this.nodes.find((n) => n.id === id);
  }

  /** Devuelve los ids de los nodos conectados (adyacentes) a uno dado. */
  printAdjacency(id: string): string[] {
    const vecinos = this.adjList[id] ?? [];
    console.log(`Adyacencia de "${id}":`, vecinos);
    return vecinos;
  }

  /** true si el grafo todavía no tiene nodos. */
  isEmpty(): boolean {
    return this.nodes.length === 0;
  }

  /** Elimina un nodo y todas las aristas que lo referencian. */
  removeNode(id: string): void {
    this.nodes = this.nodes.filter((n) => n.id !== id);
    delete this.adjList[id];
    for (const key of Object.keys(this.adjList)) {
      this.adjList[key] = this.adjList[key].filter((vecino) => vecino !== id);
    }
  }

  /** Imprime en consola todo el grafo (lista de adyacencia completa). */
  print(): void {
    console.log(this.adjList);
  }

  getNodes(): GraphNode<T>[] {
    return [...this.nodes];
  }

  getAdjList(): Record<string, string[]> {
    return { ...this.adjList };
  }

  /** Todas las aristas como pares [origen, destino], sin duplicar (a-b == b-a). */
  getEdges(): Array<[string, string]> {
    const vistas = new Set<string>();
    const aristas: Array<[string, string]> = [];

    for (const [origen, vecinos] of Object.entries(this.adjList)) {
      for (const destino of vecinos) {
        const clave = [origen, destino].sort().join('|');
        if (!vistas.has(clave)) {
          vistas.add(clave);
          aristas.push([origen, destino]);
        }
      }
    }
    return aristas;
  }
}
