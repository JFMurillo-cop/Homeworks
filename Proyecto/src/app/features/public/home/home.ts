import { Component, computed, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { injectAddToCart } from '../../../core/services/add-to-cart';
import { ProductService } from '../../../core/services/product.service';
import { ProductCard } from '../../../shared/components/product-card/product-card';

@Component({
  selector: 'app-home',
  imports: [RouterLink, ProductCard],
  templateUrl: './home.html',
  styleUrl: './home.scss',
})
export class Home {
  private readonly products = inject(ProductService);
  protected readonly addToCart = injectAddToCart();
  /** Top 4 sacado del MaxHeap de ventas. */
  protected readonly topSellers = computed(() => {
    this.products.products(); // dependencia: recalcula al cambiar el catálogo
    return this.products.topSellers(4);
  });
  protected readonly categories = this.products.categories;
}
