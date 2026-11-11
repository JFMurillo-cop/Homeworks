import { Injectable, computed, signal } from '@angular/core';
import { Trie } from '../models/trie';
import { Heap } from '../models/heap';
import { Product } from '../models/product';

@Injectable({ providedIn: 'root' })
export class SearchEngineService {
  private trie = new Trie();

  private productosSignal = signal<Product[]>([]);
  readonly productos = this.productosSignal.asReadonly();

  readonly isEmpty = computed(() => this.productosSignal().length === 0);

  /** Guarda un producto nuevo en el Trie (y en la lista que se muestra en pantalla). */
  addProduct(name: string, popularity: number): void {
    const texto = name.trim().toLowerCase();
    if (!texto) throw new Error('El producto debe tener un nombre.');
    if (!Number.isFinite(popularity) || popularity < 0) {
      throw new Error('La popularidad debe ser un número válido.');
    }

    const producto: Product = { name: texto, popularity };
    this.trie.insert(producto);
    this.productosSignal.update((lista) => [...lista, producto]);
  }

  /**
   * Busca todos los productos cuyo nombre empieza por 'prefix' (usando el
   * Trie) y devuelve solo los K más populares (usando un Heap como
   * max-heap de popularidad, tal como pide el reto).
   */
  searchTopK(prefix: string, k: number): Product[] {
    const texto = prefix.trim();
    if (!texto) return [];

    const coincidencias = this.trie.searchByPrefix(texto);
    if (coincidencias.length === 0) return [];

    // Max-heap por popularidad: compare(a,b) < 0 significa "a va primero",
    // y queremos que el más popular (número más alto) quede arriba.
    const heap = new Heap<Product>((a, b) => b.popularity - a.popularity);
    for (const producto of coincidencias) {
      heap.push(producto);
    }

    const topK: Product[] = [];
    const limite = Math.min(k, heap.size());
    for (let i = 0; i < limite; i++) {
      const siguiente = heap.pop();
      if (siguiente) topK.push(siguiente);
    }

    return topK;
  }
}
