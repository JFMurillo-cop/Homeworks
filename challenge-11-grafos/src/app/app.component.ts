import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { GraphService } from './services/graph.service';
import { GraphViewComponent } from './components/graph-view/graph-view.component';
import { GraphNode } from './models/graph';
import { PersonData } from './models/person-city';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, FormsModule, GraphViewComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  protected graphService = inject(GraphService);

  // Formulario: nueva ciudad
  nuevaCiudad = '';
  errorCiudad = signal<string | null>(null);

  // Formulario: nueva persona
  nombrePersona = '';
  edadPersona: number | null = null;
  ciudadPersonaId = '';
  errorPersona = signal<string | null>(null);

  // Consulta: personas por ciudad
  ciudadConsultaId = signal<string>('');
  resultadoConsulta = signal<GraphNode<PersonData>[] | null>(null);

  agregarCiudad(): void {
    this.errorCiudad.set(null);
    try {
      this.graphService.addCity(this.nuevaCiudad);
      this.nuevaCiudad = '';
    } catch (err) {
      this.errorCiudad.set((err as Error).message);
    }
  }

  agregarPersona(): void {
    this.errorPersona.set(null);
    try {
      this.graphService.addPerson(
        this.nombrePersona,
        Number(this.edadPersona),
        this.ciudadPersonaId,
      );
      this.nombrePersona = '';
      this.edadPersona = null;
      this.ciudadPersonaId = '';
    } catch (err) {
      this.errorPersona.set((err as Error).message);
    }
  }

  consultarCiudad(cityId: string): void {
    this.ciudadConsultaId.set(cityId);
    if (!cityId) {
      this.resultadoConsulta.set(null);
      return;
    }
    this.resultadoConsulta.set(this.graphService.peopleInCity(cityId));
  }

  eliminarNodo(id: string): void {
    this.graphService.removeNode(id);
    if (this.ciudadConsultaId()) {
      this.consultarCiudad(this.ciudadConsultaId());
    }
  }

  imprimirEnConsola(): void {
    this.graphService.printGraph();
  }
}
