import { Component, computed, inject, input, output } from '@angular/core';
import { DeliveryService } from '../../../core/services/delivery.service';

/**
 * Mapa del campus dibujado en SVG a partir del grafo.
 * Inputs: punto seleccionado y ruta a resaltar. Output: clic en un punto.
 */
@Component({
  selector: 'app-campus-map',
  template: `
    <svg viewBox="0 0 620 400" role="img" aria-label="Mapa de puntos de entrega del campus">
      <rect x="0" y="0" width="620" height="400" rx="16" class="ground" />
      <ellipse cx="560" cy="110" rx="45" ry="28" class="water" />

      @for (e of edges(); track e.key) {
        <line [attr.x1]="e.x1" [attr.y1]="e.y1" [attr.x2]="e.x2" [attr.y2]="e.y2"
              class="edge" [class.on-route]="e.onRoute" />
        <text [attr.x]="(e.x1 + e.x2) / 2" [attr.y]="(e.y1 + e.y2) / 2 - 4" class="weight">{{ e.weight }}m</text>
      }

      @for (p of delivery.points; track p.id) {
        <g class="point" [class.store]="!p.deliverable" [class.selected]="p.id === selected()"
           [class.on-route]="route().includes(p.id)" (click)="p.deliverable && pick.emit(p.id)">
          <circle [attr.cx]="p.x" [attr.cy]="p.y" [attr.r]="p.deliverable ? 11 : 15" />
          <text [attr.x]="p.x" [attr.y]="p.y + 30" class="label">{{ p.label }}</text>
          @if (!p.deliverable) {
            <text [attr.x]="p.x" [attr.y]="p.y + 5" class="icon">🛍️</text>
          }
        </g>
      }
    </svg>
  `,
  styles: `
    svg { width: 100%; height: auto; display: block; }
    .ground { fill: #eef6ea; }
    .water { fill: #cfe6ff; }
    .edge { stroke: #b9c2cc; stroke-width: 4; stroke-linecap: round; }
    .edge.on-route { stroke: var(--primary); stroke-width: 7; }
    .weight { font-size: 10px; fill: var(--muted); text-anchor: middle; }
    .point { cursor: pointer; }
    .point circle { fill: #fff; stroke: var(--accent); stroke-width: 3; transition: r 0.15s; }
    .point:hover circle { stroke-width: 5; }
    .point.on-route circle { stroke: var(--primary); }
    .point.selected circle { fill: var(--primary); stroke: var(--primary-dark); }
    .point.store { cursor: default; }
    .point.store circle { fill: var(--primary); stroke: var(--primary-dark); }
    .label { font-size: 11px; font-weight: 600; text-anchor: middle; fill: var(--text); paint-order: stroke; stroke: #eef6ea; stroke-width: 3px; }
    .icon { font-size: 14px; text-anchor: middle; }
  `,
})
export class CampusMap {
  protected readonly delivery = inject(DeliveryService);
  readonly selected = input<string | null>(null);
  readonly route = input<string[]>([]);
  readonly pick = output<string>();

  protected readonly edges = computed(() => {
    const route = this.route();
    const onRoute = new Set<string>();
    for (let i = 0; i < route.length - 1; i++) {
      onRoute.add(`${route[i]}|${route[i + 1]}`);
      onRoute.add(`${route[i + 1]}|${route[i]}`);
    }
    return this.delivery.paths.map(([a, b, weight]) => {
      const pa = this.delivery.point(a)!;
      const pb = this.delivery.point(b)!;
      return {
        key: `${a}|${b}`,
        x1: pa.x, y1: pa.y, x2: pb.x, y2: pb.y,
        weight,
        onRoute: onRoute.has(`${a}|${b}`),
      };
    });
  });
}
