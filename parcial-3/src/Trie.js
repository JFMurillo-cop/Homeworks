// ===============================================
// Buscador predictivo de canciones: TRIE
// ===============================================
// Cada nodo guarda sus hijos (un Map letra -> nodo) y una
// bandera que indica si en ese nodo termina un título.

class TrieNode {
  constructor() {
    this.children = new Map();
    this.isEnd = false;
    this.title = null; // título original (con mayúsculas y tildes)
  }
}

export class Trie {
  constructor() {
    this.root = new TrieNode();
    this.size = 0;
  }

  // Normaliza para que la búsqueda no distinga mayúsculas
  static normalize(text) {
    return text.trim().toLowerCase();
  }

  // 1. Insertar canción  -> O(L), L = largo del título
  insert(title) {
    const word = Trie.normalize(title);
    if (!word) return false;

    let node = this.root;
    for (const ch of word) {
      if (!node.children.has(ch)) node.children.set(ch, new TrieNode());
      node = node.children.get(ch);
    }
    if (node.isEnd) return false; // ya existía
    node.isEnd = true;
    node.title = title.trim();
    this.size++;
    return true;
  }

  // Recorre el trie siguiendo el texto; devuelve el nodo final o null
  #findNode(text) {
    let node = this.root;
    for (const ch of Trie.normalize(text)) {
      node = node.children.get(ch);
      if (!node) return null;
    }
    return node;
  }

  // 2. Buscar si una canción existe -> O(L)
  search(title) {
    const node = this.#findNode(title);
    return node !== null && node.isEnd;
  }

  // 3. Sugerencias por prefijo -> O(P + N), P = largo del prefijo,
  //    N = nodos del subárbol recorrido (DFS)
  suggest(prefix, limit = 10) {
    const results = [];
    if (!Trie.normalize(prefix)) return results;

    const start = this.#findNode(prefix);
    if (!start) return results;

    const dfs = (node) => {
      if (results.length >= limit) return;
      if (node.isEnd) results.push(node.title);
      // orden alfabético de las sugerencias
      const keys = [...node.children.keys()].sort();
      for (const k of keys) dfs(node.children.get(k));
    };
    dfs(start);
    return results;
  }
}
