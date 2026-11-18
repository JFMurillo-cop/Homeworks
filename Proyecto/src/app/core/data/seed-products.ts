import { Product } from '../models';

/**
 * Catálogo inicial. El administrador puede cargarlo a Firestore desde el panel.
 * Si Firebase no está configurado, la app lo usa como catálogo local de solo lectura.
 */
export const SEED_PRODUCTS: Product[] = [
  { id: 'cafe-americano', name: 'Café americano', description: 'Café de origen colombiano, 12 oz.', price: 4500, category: 'Cafetería', emoji: '☕', stock: 80, sold: 120 },
  { id: 'capuccino', name: 'Capuccino', description: 'Espresso con leche espumada y canela.', price: 6500, category: 'Cafetería', emoji: '🥛', stock: 60, sold: 95 },
  { id: 'empanada', name: 'Empanada vallecaucana', description: 'Empanada de pipián con ají.', price: 3000, category: 'Cafetería', emoji: '🥟', stock: 100, sold: 210 },
  { id: 'pandebono', name: 'Pandebono', description: 'Recién horneado, ideal con café.', price: 2500, category: 'Cafetería', emoji: '🧀', stock: 90, sold: 180 },
  { id: 'jugo-natural', name: 'Jugo natural de lulo', description: 'Jugo en agua o en leche, 16 oz.', price: 5000, category: 'Cafetería', emoji: '🧃', stock: 50, sold: 70 },
  { id: 'cuaderno', name: 'Cuaderno argollado', description: '100 hojas cuadriculadas, tamaño carta.', price: 9000, category: 'Papelería', emoji: '📓', stock: 40, sold: 55 },
  { id: 'lapicero', name: 'Lapicero gel', description: 'Tinta negra, punta 0.7 mm.', price: 2500, category: 'Papelería', emoji: '🖊️', stock: 150, sold: 160 },
  { id: 'calculadora', name: 'Calculadora científica', description: '252 funciones, ideal para cálculo.', price: 65000, category: 'Papelería', emoji: '🧮', stock: 15, sold: 22 },
  { id: 'resaltadores', name: 'Resaltadores x4', description: 'Colores pastel, punta biselada.', price: 12000, category: 'Papelería', emoji: '🖍️', stock: 35, sold: 40 },
  { id: 'audifonos', name: 'Audífonos bluetooth', description: 'Hasta 20 horas de batería.', price: 89000, category: 'Tecnología', emoji: '🎧', stock: 12, sold: 18 },
  { id: 'cargador', name: 'Cargador USB-C 20W', description: 'Carga rápida para celular.', price: 35000, category: 'Tecnología', emoji: '🔌', stock: 25, sold: 48 },
  { id: 'memoria-usb', name: 'Memoria USB 64GB', description: 'USB 3.0, alta velocidad.', price: 28000, category: 'Tecnología', emoji: '💾', stock: 30, sold: 33 },
  { id: 'mouse', name: 'Mouse inalámbrico', description: 'Silencioso, 1600 DPI.', price: 42000, category: 'Tecnología', emoji: '🖱️', stock: 20, sold: 27 },
  { id: 'camiseta', name: 'Camiseta del campus', description: 'Algodón, logo bordado.', price: 45000, category: 'Ropa', emoji: '👕', stock: 30, sold: 38 },
  { id: 'buzo', name: 'Buzo con capota', description: 'Perchado, ideal para clases de la mañana.', price: 95000, category: 'Ropa', emoji: '🧥', stock: 18, sold: 21 },
  { id: 'gorra', name: 'Gorra bordada', description: 'Ajustable, varios colores.', price: 30000, category: 'Ropa', emoji: '🧢', stock: 25, sold: 15 },
];
