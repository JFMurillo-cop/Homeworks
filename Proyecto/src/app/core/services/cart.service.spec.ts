import { TestBed } from '@angular/core/testing';
import { SEED_PRODUCTS } from '../data/seed-products';
import { CartService } from './cart.service';
import { DeliveryService } from './delivery.service';

describe('CartService', () => {
  let cart: CartService;
  const [cafe, pandebono] = SEED_PRODUCTS;

  beforeEach(() => {
    localStorage.clear();
    cart = TestBed.inject(CartService);
  });

  it('agrega, suma cantidades y calcula subtotal', () => {
    cart.add(cafe);
    cart.add(pandebono, 2);
    cart.add(cafe);
    expect(cart.items().map((i) => [i.productId, i.quantity])).toEqual([
      [cafe.id, 2],
      [pandebono.id, 2],
    ]);
    expect(cart.count()).toBe(4);
    expect(cart.subtotal()).toBe(cafe.price * 2 + pandebono.price * 2);
  });

  it('deshace en orden LIFO', () => {
    cart.add(cafe);
    cart.add(pandebono);
    cart.setQuantity(cafe.id, 5);
    cart.remove(pandebono.id);

    cart.undo(); // vuelve el pandebono
    expect(cart.items().length).toBe(2);
    cart.undo(); // cantidad de café vuelve a 1
    expect(cart.items()[0].quantity).toBe(1);
    cart.undo();
    cart.undo();
    expect(cart.items()).toEqual([]);
    expect(cart.canUndo()).toBe(false);
  });

  it('persiste en localStorage', () => {
    cart.add(cafe);
    expect(JSON.parse(localStorage.getItem('campusmarket.cart')!)[0].productId).toBe(cafe.id);
  });
});

describe('DeliveryService', () => {
  it('cotiza la ruta más corta al coliseo', () => {
    const quote = TestBed.inject(DeliveryService).quote('coliseo')!;
    expect(quote.path).toEqual(['tienda', 'cafeteria', 'auditorio', 'coliseo']);
    expect(quote.distance).toBe(500);
    expect(quote.fee).toBe(3500);
  });
});
