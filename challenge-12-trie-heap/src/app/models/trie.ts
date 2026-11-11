import { Product } from './product';

/**
 * Trie (árbol de caracteres) implementado desde cero, tal como se vio en
 * clase: cada nodo tiene un mapa de hijos (una letra -> otro nodo) y una
 * bandera isEndOfWord. En vez de guardar solo la palabra, cada nodo final
 * guarda también el producto completo (nombre + popularidad), que es lo
 * que necesitamos para el buscador.
 */
class TrieNode {
  children: Record<string, TrieNode> = {};
  isEndOfWord = false;
  product: Product | null = null;
}

export class Trie {
  private root = new TrieNode();

  /** Inserta un producto, recorriendo/creando un nodo por cada letra de su nombre. */
  insert(product: Product): void {
    let current = this.root;
    const key = product.name.toLowerCase();

    for (const character of key) {
      if (current.children[character] === undefined) {
        current.children[character] = new TrieNode();
      }
      current = current.children[character];
    }

    current.isEndOfWord = true;
    current.product = product;
  }

  /** true si existe un producto con exactamente ese nombre. */
  search(word: string): boolean {
    const node = this.findNode(word);
    return !!node && node.isEndOfWord;
  }

  /** Busca el nodo donde termina un prefijo, recorriendo letra por letra desde la raíz. */
  private findNode(prefix: string): TrieNode | null {
    let current = this.root;
    for (const character of prefix.toLowerCase()) {
      if (current.children[character] === undefined) return null;
      current = current.children[character];
    }
    return current;
  }

  /** Todos los productos cuyo nombre empieza por 'prefix' (búsqueda por prefijo). */
  searchByPrefix(prefix: string): Product[] {
    const node = this.findNode(prefix);
    if (!node) return [];

    const resultados: Product[] = [];
    this.collect(node, resultados);
    return resultados;
  }

  /** Recorre (DFS) todos los descendientes de un nodo recogiendo los productos. */
  private collect(node: TrieNode, out: Product[]): void {
    if (node.isEndOfWord && node.product) {
      out.push(node.product);
    }
    for (const key of Object.keys(node.children)) {
      this.collect(node.children[key], out);
    }
  }
}
