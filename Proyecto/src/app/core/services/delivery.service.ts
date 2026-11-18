import { Injectable } from '@angular/core';
import { Graph } from '../data-structures/graph';
import {
  CAMPUS_PATHS,
  CAMPUS_POINTS,
  CampusPoint,
  DELIVERY_BASE_FEE,
  DELIVERY_FEE_PER_100M,
  DELIVERY_SPEED_M_PER_MIN,
  STORE_POINT,
} from '../data/campus-map';

export interface DeliveryQuote {
  pointId: string;
  path: string[];
  distance: number;
  fee: number;
  minutes: number;
}

/** Construye el grafo del campus y calcula rutas de entrega con Dijkstra. */
@Injectable({ providedIn: 'root' })
export class DeliveryService {
  readonly graph = new Graph();
  readonly points = CAMPUS_POINTS;
  readonly paths = CAMPUS_PATHS;
  readonly store = STORE_POINT;

  constructor() {
    CAMPUS_POINTS.forEach((p) => this.graph.addVertex(p.id));
    CAMPUS_PATHS.forEach(([a, b, w]) => this.graph.addEdge(a, b, w));
  }

  point(id: string): CampusPoint | undefined {
    return this.points.find((p) => p.id === id);
  }

  label(id: string): string {
    return this.point(id)?.label ?? id;
  }

  quote(pointId: string): DeliveryQuote | null {
    const result = this.graph.shortestPath(STORE_POINT, pointId);
    if (!result) return null;
    return {
      pointId,
      path: result.path,
      distance: result.distance,
      fee: DELIVERY_BASE_FEE + Math.ceil(result.distance / 100) * DELIVERY_FEE_PER_100M,
      minutes: Math.max(3, Math.round(result.distance / DELIVERY_SPEED_M_PER_MIN)),
    };
  }
}
