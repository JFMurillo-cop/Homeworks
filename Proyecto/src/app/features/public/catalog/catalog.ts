import { Component, computed, inject, input, linkedSignal } from '@angular/core';
import { Router } from '@angular/router';
import { injectAddToCart } from '../../../core/services/add-to-cart';
import { ProductService } from '../../../core/services/product.service';
import { Category } from '../../../core/models';
import { ProductCard } from '../../../shared/components/product-card/product-card';
import { SearchBox } from '../../../shared/components/search-box/search-box';

type SortKey = 'relevancia' | 'precio-asc' | 'precio-desc' | 'vendidos';

/** Componente padre del catálogo: coordina buscador (hijo) y tarjetas (hijos). */
@Component({
  selector: 'app-catalog',
  imports: [ProductCard, SearchBox],
  templateUrl: './catalog.html',
  styleUrl: './catalog.scss',
})
export class Catalog {
  protected readonly products = inject(ProductService);
  private readonly router = inject(Router);
  protected readonly addToCart = injectAddToCart();

  /** Query params enlazados como inputs (withComponentInputBinding). */
  readonly categoria = input<string>();
  readonly q = input<string>();

  protected readonly query = linkedSignal(() => this.q() ?? '');
  protected readonly category = linkedSignal<Category | null>(
    () => (this.categoria() as Category) ?? null,
  );
  protected readonly sort = linkedSignal<SortKey>(() => 'relevancia');

  protected readonly results = computed(() => {
    let list = this.products.search(this.query());
    const cat = this.category();
    if (cat) list = list.filter((p) => p.category === cat);
    const sorted = [...list];
    switch (this.sort()) {
      case 'precio-asc':
        return sorted.sort((a, b) => a.price - b.price);
      case 'precio-desc':
        return sorted.sort((a, b) => b.price - a.price);
      case 'vendidos':
        return sorted.sort((a, b) => b.sold - a.sold);
      default:
        return sorted;
    }
  });

  setCategory(cat: Category | null): void {
    this.category.set(cat);
    this.router.navigate([], { queryParams: { categoria: cat }, queryParamsHandling: 'merge' });
  }

  setSort(value: string): void {
    this.sort.set(value as SortKey);
  }
}
