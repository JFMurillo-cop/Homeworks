import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SearchEngineService } from './services/search-engine.service';
import { Product } from './models/product';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  protected srv = inject(SearchEngineService);

  // Formulario: nuevo producto
  nombreProducto = '';
  popularidadProducto: number | null = null;
  errorProducto = signal<string | null>(null);

  // Buscador
  prefijo = '';
  k = 3;
  resultados = signal<Product[]>([]);
  buscoAlgunaVez = signal(false);

  agregarProducto(): void {
    this.errorProducto.set(null);
    try {
      this.srv.addProduct(this.nombreProducto, Number(this.popularidadProducto));
      this.nombreProducto = '';
      this.popularidadProducto = null;
      // Si ya había una búsqueda activa, la refrescamos con el nuevo producto.
      if (this.buscoAlgunaVez() && this.prefijo.trim()) {
        this.buscar();
      }
    } catch (err) {
      this.errorProducto.set((err as Error).message);
    }
  }

  cargarEjemplo(): void {
    this.srv.addProduct('air max', 90);
    this.srv.addProduct('air force', 95);
    this.srv.addProduct('air jordan', 85);
    this.srv.addProduct('adidas boost', 80);
  }

  buscar(): void {
    this.buscoAlgunaVez.set(true);
    this.resultados.set(this.srv.searchTopK(this.prefijo, Number(this.k) || 0));
  }
}
