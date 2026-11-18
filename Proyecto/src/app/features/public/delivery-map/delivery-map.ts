import { Component, computed, inject, signal } from '@angular/core';
import { DeliveryService } from '../../../core/services/delivery.service';
import { CampusMap } from '../../../shared/components/campus-map/campus-map';
import { CopPipe } from '../../../shared/pipes/cop.pipe';

/** Página pública que muestra el grafo del campus y la ruta más corta (Dijkstra). */
@Component({
  selector: 'app-delivery-map',
  imports: [CampusMap, CopPipe],
  template: `
    <div class="container page">
      <h1>Mapa de entregas</h1>
      <p class="muted">Haz clic en un edificio para ver la ruta más corta desde nuestra tienda, el costo y el tiempo estimado.</p>
      <div class="layout">
        <div class="card map">
          <app-campus-map [selected]="selected()" [route]="quote()?.path ?? []" (pick)="selected.set($event)" />
        </div>
        <aside class="card">
          @if (quote(); as q) {
            <h3>📍 {{ delivery.label(q.pointId) }}</h3>
            <ol class="route">
              @for (stop of q.path; track stop) {
                <li>{{ delivery.label(stop) }}</li>
              }
            </ol>
            <p><strong>Distancia:</strong> {{ q.distance }} m</p>
            <p><strong>Tiempo estimado:</strong> {{ q.minutes }} min</p>
            <p><strong>Costo del domicilio:</strong> {{ q.fee | cop }}</p>
          } @else {
            <p class="muted">Selecciona un punto de entrega en el mapa.</p>
          }
        </aside>
      </div>
    </div>
  `,
  styles: `
    .layout { display: grid; grid-template-columns: 2fr 1fr; gap: 1rem; margin-top: 1rem; }
    .map { padding: 0.5rem; }
    .route { padding-left: 1.2rem; li { margin: 0.2rem 0; } }
    @media (max-width: 800px) { .layout { grid-template-columns: 1fr; } }
  `,
})
export class DeliveryMap {
  protected readonly delivery = inject(DeliveryService);
  protected readonly selected = signal<string | null>(null);
  protected readonly quote = computed(() => {
    const id = this.selected();
    return id ? this.delivery.quote(id) : null;
  });
}
