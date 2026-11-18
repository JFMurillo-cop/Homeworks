/**
 * Puntos del campus (vértices del grafo) con coordenadas para dibujarlos en el
 * mapa SVG, y caminos (aristas) con su distancia en metros.
 */
export interface CampusPoint {
  id: string;
  label: string;
  x: number;
  y: number;
  deliverable: boolean;
}

export const STORE_POINT = 'tienda';

export const CAMPUS_POINTS: CampusPoint[] = [
  { id: 'tienda', label: 'Tienda CampusMarket', x: 80, y: 220, deliverable: false },
  { id: 'porteria', label: 'Portería principal', x: 60, y: 60, deliverable: true },
  { id: 'biblioteca', label: 'Biblioteca', x: 230, y: 90, deliverable: true },
  { id: 'cafeteria', label: 'Cafetería central', x: 220, y: 250, deliverable: true },
  { id: 'edificio-a', label: 'Edificio A (aulas)', x: 380, y: 60, deliverable: true },
  { id: 'edificio-b', label: 'Edificio B (labs)', x: 400, y: 190, deliverable: true },
  { id: 'auditorio', label: 'Auditorio', x: 350, y: 330, deliverable: true },
  { id: 'coliseo', label: 'Coliseo deportivo', x: 540, y: 300, deliverable: true },
  { id: 'lago', label: 'Lago', x: 540, y: 120, deliverable: true },
  { id: 'parqueadero', label: 'Parqueadero', x: 160, y: 360, deliverable: true },
];

export const CAMPUS_PATHS: [string, string, number][] = [
  ['tienda', 'porteria', 170],
  ['tienda', 'cafeteria', 150],
  ['tienda', 'parqueadero', 160],
  ['porteria', 'biblioteca', 180],
  ['biblioteca', 'cafeteria', 160],
  ['biblioteca', 'edificio-a', 160],
  ['cafeteria', 'edificio-b', 190],
  ['cafeteria', 'auditorio', 160],
  ['cafeteria', 'parqueadero', 130],
  ['edificio-a', 'edificio-b', 140],
  ['edificio-a', 'lago', 170],
  ['edificio-b', 'lago', 150],
  ['edificio-b', 'auditorio', 150],
  ['edificio-b', 'coliseo', 170],
  ['auditorio', 'coliseo', 190],
  ['auditorio', 'parqueadero', 200],
  ['lago', 'coliseo', 180],
];

/** Tarifa: base + valor por cada 100 m recorridos. */
export const DELIVERY_BASE_FEE = 1000;
export const DELIVERY_FEE_PER_100M = 500;
/** Velocidad promedio del domiciliario caminando (m/min). */
export const DELIVERY_SPEED_M_PER_MIN = 70;
