/**
 * Trie (árbol de prefijos).
 * Uso en el proyecto: autocompletado del buscador de productos (SearchBox).
 * Insertar y buscar un prefijo cuesta O(L), con L = longitud de la palabra,
 * sin importar cuántos productos haya en el catálogo.
 *
 * Cada palabra guarda un conjunto de "ids" asociados (por ejemplo, los ids de
 * productos cuyo nombre contiene esa palabra).
 */
class TrieNode {
  children = new Map<string, TrieNode>();
  isEnd = false;
  ids = new Set<string>();
}

export class Trie {
  private root = new TrieNode();
  private wordCount = 0;

  get size(): number {
    return this.wordCount;
  }

  /** Normaliza: minúsculas y sin tildes, para que "cafe" encuentre "Café". */
  static normalize(text: string): string {
    return text
      .toLowerCase()
      .normalize('NFD')
      .replace(/[̀-ͯ]/g, '')
      .trim();
  }

  insert(word: string, id?: string): void {
    const clean = Trie.normalize(word);
    if (!clean) return;
    let node = this.root;
    for (const char of clean) {
      if (!node.children.has(char)) node.children.set(char, new TrieNode());
      node = node.children.get(char)!;
    }
    if (!node.isEnd) {
      node.isEnd = true;
      this.wordCount++;
    }
    if (id !== undefined) node.ids.add(id);
  }

  /** Inserta cada palabra de un texto (ej. el nombre completo del producto). */
  insertText(text: string, id: string): void {
    Trie.normalize(text)
      .split(/\s+/)
      .forEach((w) => this.insert(w, id));
  }

  has(word: string): boolean {
    const node = this.findNode(Trie.normalize(word));
    return !!node?.isEnd;
  }

  startsWith(prefix: string): boolean {
    return this.findNode(Trie.normalize(prefix)) !== null;
  }

  /** Palabras completas que comienzan con el prefijo (ordenadas alfabéticamente). */
  autocomplete(prefix: string, limit = 8): string[] {
    const clean = Trie.normalize(prefix);
    const start = this.findNode(clean);
    if (!clean || !start) return [];
    const results: string[] = [];
    this.collect(start, clean, results, limit);
    return results;
  }

  /** Ids asociados a todas las palabras que comienzan con el prefijo. */
  searchIds(prefix: string): Set<string> {
    const clean = Trie.normalize(prefix);
    const ids = new Set<string>();
    const start = this.findNode(clean);
    if (!clean || !start) return ids;
    const stack: TrieNode[] = [start];
    while (stack.length) {
      const node = stack.pop()!;
      node.ids.forEach((id) => ids.add(id));
      node.children.forEach((child) => stack.push(child));
    }
    return ids;
  }

  private findNode(prefix: string): TrieNode | null {
    let node = this.root;
    for (const char of prefix) {
      const next = node.children.get(char);
      if (!next) return null;
      node = next;
    }
    return node;
  }

  private collect(node: TrieNode, prefix: string, out: string[], limit: number): void {
    if (out.length >= limit) return;
    if (node.isEnd) out.push(prefix);
    const keys = [...node.children.keys()].sort();
    for (const key of keys) {
      if (out.length >= limit) return;
      this.collect(node.children.get(key)!, prefix + key, out, limit);
    }
  }
}
