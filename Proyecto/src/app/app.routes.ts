import { Routes } from '@angular/router';
import { adminGuard, authGuard, guestGuard } from './core/guards/auth.guards';

export const routes: Routes = [
  // ===== Rutas públicas =====
  {
    path: '',
    title: 'CampusMarket',
    loadComponent: () => import('./features/public/home/home').then((m) => m.Home),
  },
  {
    path: 'catalogo',
    title: 'Catálogo · CampusMarket',
    loadComponent: () => import('./features/public/catalog/catalog').then((m) => m.Catalog),
  },
  {
    path: 'producto/:id',
    title: 'Producto · CampusMarket',
    loadComponent: () =>
      import('./features/public/product-detail/product-detail').then((m) => m.ProductDetail),
  },
  {
    path: 'mapa',
    title: 'Mapa de entregas · CampusMarket',
    loadComponent: () =>
      import('./features/public/delivery-map/delivery-map').then((m) => m.DeliveryMap),
  },
  {
    path: 'login',
    title: 'Ingresar · CampusMarket',
    canActivate: [guestGuard],
    loadComponent: () => import('./features/auth/login/login').then((m) => m.Login),
  },
  {
    path: 'registro',
    title: 'Crear cuenta · CampusMarket',
    canActivate: [guestGuard],
    loadComponent: () => import('./features/auth/register/register').then((m) => m.Register),
  },

  // ===== Rutas privadas (cliente con sesión) =====
  {
    path: '',
    canActivateChild: [authGuard],
    children: [
      {
        path: 'carrito',
        title: 'Carrito · CampusMarket',
        loadComponent: () => import('./features/private/cart/cart').then((m) => m.Cart),
      },
      {
        path: 'checkout',
        title: 'Entrega y pago · CampusMarket',
        loadComponent: () =>
          import('./features/private/checkout/checkout').then((m) => m.Checkout),
      },
      {
        path: 'mis-pedidos',
        title: 'Mis pedidos · CampusMarket',
        loadComponent: () => import('./features/private/orders/orders').then((m) => m.Orders),
      },
      {
        path: 'soporte',
        title: 'Soporte · CampusMarket',
        loadComponent: () => import('./features/private/support/support').then((m) => m.Support),
      },
    ],
  },

  // ===== Rutas de administración (rol admin) =====
  {
    path: 'admin',
    canActivate: [adminGuard],
    canActivateChild: [adminGuard],
    children: [
      {
        path: '',
        title: 'Panel admin · CampusMarket',
        loadComponent: () =>
          import('./features/admin/dashboard/dashboard').then((m) => m.Dashboard),
      },
      {
        path: 'chat/:uid',
        title: 'Chat · CampusMarket',
        loadComponent: () =>
          import('./features/admin/admin-chat/admin-chat').then((m) => m.AdminChat),
      },
    ],
  },

  {
    path: '**',
    title: 'No encontrado · CampusMarket',
    loadComponent: () => import('./features/public/not-found/not-found').then((m) => m.NotFound),
  },
];
