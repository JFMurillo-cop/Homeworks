import { Injectable, computed, signal } from '@angular/core';
import { collection, doc, onSnapshot, writeBatch } from 'firebase/firestore';
import { Heap } from '../data-structures/heap';
import { Trie } from '../data-structures/trie';
import { SEED_PRODUCTS } from '../data/seed-products';
import { Category, Product } from '../models';
import { firebaseConfigured, firestore } from './firebase';

@Injectable({ providedIn: 'root' })
export class ProductService {
  private readonly _products = signal<Product[]>(SEED_PRODUCTS);
  readonly products = this._products.asReadonly();
  /** true mientras se muestra el catálogo local (Firestore vacío o sin configurar). */
  readonly usingSeed = signal(true);
  readonly loading = signal(firebaseConfigured);

  readonly categories: Category[] = ['Cafetería', 'Papelería', 'Tecnología', 'Ropa'];

  /** Trie reconstruido cada vez que cambia el catálogo: indexa cada palabra del nombre. */
  readonly searchIndex = computed(() => {
    const trie = new Trie();
    for (const p of this._products()) {
      trie.insertText(p.name, p.id);
      trie.insert(p.category, p.id);
    }
    return trie;
  });

  /** MaxHeap por unidades vendidas para el ranking "Más vendidos". */
  private readonly salesHeap = computed(() =>
    Heap.fromArray(this._products(), (a, b) => b.sold - a.sold),
  );

  constructor() {
    if (!firebaseConfigured) return;
    // Suscripción en tiempo real: stock y ventas se actualizan sin recargar.
    onSnapshot(
      collection(firestore(), 'products'),
      (snap) => {
        const remote = snap.docs.map((d) => ({ ...(d.data() as Product), id: d.id }));
        this.usingSeed.set(remote.length === 0);
        this._products.set(remote.length ? remote : SEED_PRODUCTS);
        this.loading.set(false);
      },
      () => this.loading.set(false),
    );
  }

  getById(id: string): Product | undefined {
    return this._products().find((p) => p.id === id);
  }

  topSellers(k: number): Product[] {
    return this.salesHeap().top(k);
  }

  /** Productos cuyo nombre o categoría tiene alguna palabra que empieza por `query`. */
  search(query: string): Product[] {
    const words = Trie.normalize(query).split(/\s+/).filter(Boolean);
    if (!words.length) return this._products();
    // Intersección: cada palabra escrita debe coincidir con el producto.
    const [first, ...rest] = words.map((w) => this.searchIndex().searchIds(w));
    const ids = new Set<string>([...first].filter((id) => rest.every((set) => set.has(id))));
    return this._products().filter((p) => ids.has(p.id));
  }

  suggestions(prefix: string): string[] {
    const last = prefix.split(/\s+/).pop() ?? '';
    return this.searchIndex().autocomplete(last, 6);
  }

  /** Carga el catálogo inicial a Firestore (solo administrador). */
  async seedCatalog(): Promise<void> {
    const batch = writeBatch(firestore());
    for (const p of SEED_PRODUCTS) batch.set(doc(firestore(), 'products', p.id), p);
    await batch.commit();
  }
}
