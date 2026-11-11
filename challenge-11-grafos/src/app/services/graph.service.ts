import { Injectable, computed, signal } from '@angular/core';
import { Graph, GraphNode } from '../models/graph';
import { CityData, NodeData, PersonData } from '../models/person-city';

let contador = 0;
function nuevoId(prefijo: string): string {
  contador += 1;
  return `${prefijo}-${Date.now()}-${contador}`;
}

@Injectable({ providedIn: 'root' })
export class GraphService {
  private graph = new Graph<NodeData>();

  // Se incrementa en cada cambio, para que los signals/computed de abajo
  // (y el componente que dibuja con d3) sepan que deben recalcular/redibujar.
  private version = signal(0);

  readonly isEmpty = computed(() => {
    this.version();
    return this.graph.isEmpty();
  });

  readonly cities = computed(() => {
    this.version();
    return this.graph
      .getNodes()
      .filter((n): n is GraphNode<CityData> => n.data.kind === 'city');
  });

  readonly people = computed(() => {
    this.version();
    return this.graph
      .getNodes()
      .filter((n): n is GraphNode<PersonData> => n.data.kind === 'person');
  });

  readonly nodes = computed(() => {
    this.version();
    return this.graph.getNodes();
  });

  readonly edges = computed(() => {
    this.version();
    return this.graph.getEdges();
  });

  /** Crea una ciudad nueva. Toda ciudad debe tener nombre. */
  addCity(name: string): void {
    const texto = name.trim();
    if (!texto) throw new Error('La ciudad debe tener un nombre.');

    const yaExiste = this.cities().some(
      (c) => c.data.name.toLowerCase() === texto.toLowerCase(),
    );
    if (yaExiste) throw new Error(`Ya existe una ciudad llamada "${texto}".`);

    this.graph.addNode(nuevoId('city'), { kind: 'city', name: texto });
    this.touch();
  }

  /** Crea una persona nueva: nombre, edad, y una ciudad a la que queda referenciada. */
  addPerson(name: string, age: number, cityId: string): void {
    const texto = name.trim();
    if (!texto) throw new Error('La persona debe tener un nombre.');
    if (!Number.isFinite(age) || age <= 0) throw new Error('La edad debe ser un número válido.');

    const ciudad = this.graph.searchNode(cityId);
    if (!ciudad || ciudad.data.kind !== 'city') {
      throw new Error('Debes elegir una ciudad válida para la persona.');
    }

    const id = nuevoId('person');
    this.graph.addNode(id, { kind: 'person', name: texto, age, cityId });
    // La arista persona-ciudad es lo que representa "vive en".
    this.graph.addEdge(id, cityId);
    this.touch();
  }

  /** Lista de personas que viven en una ciudad particular. */
  peopleInCity(cityId: string): GraphNode<PersonData>[] {
    return this.graph
      .printAdjacency(cityId)
      .map((vecinoId) => this.graph.searchNode(vecinoId))
      .filter((n): n is GraphNode<PersonData> => !!n && n.data.kind === 'person');
  }

  removeNode(id: string): void {
    this.graph.removeNode(id);
    this.touch();
  }

  /** Imprime en consola todo el grafo (lista de adyacencia). */
  printGraph(): void {
    this.graph.print();
  }

  private touch(): void {
    this.version.update((v) => v + 1);
  }
}
