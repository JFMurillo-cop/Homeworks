import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { Product } from '../models';
import { AuthService } from './auth.service';
import { CartService } from './cart.service';
import { ToastService } from './toast.service';

/**
 * Devuelve una función para agregar al carrito con retroalimentación.
 * Si no hay sesión, lleva al login (el carrito es parte del área privada).
 * Debe llamarse en un contexto de inyección (constructor / inicializador de campo).
 */
export function injectAddToCart(): (product: Product, quantity?: number) => void {
  const auth = inject(AuthService);
  const cart = inject(CartService);
  const toast = inject(ToastService);
  const router = inject(Router);

  return (product, quantity = 1) => {
    if (!auth.isLoggedIn()) {
      toast.show('Inicia sesión para usar el carrito.');
      router.navigate(['/login'], { queryParams: { returnUrl: router.url } });
      return;
    }
    cart.add(product, quantity);
    toast.show(`${product.emoji} ${product.name} agregado al carrito`);
  };
}
