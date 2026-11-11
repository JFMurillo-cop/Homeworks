import {
  AfterViewInit,
  Component,
  ElementRef,
  OnDestroy,
  effect,
  inject,
  viewChild,
} from '@angular/core';
import * as d3 from 'd3';
import { GraphService } from '../../services/graph.service';
import { NodeData } from '../../models/person-city';

interface SimNode extends d3.SimulationNodeDatum {
  id: string;
  data: NodeData;
}

interface SimLink extends d3.SimulationLinkDatum<SimNode> {
  source: string | SimNode;
  target: string | SimNode;
}

/**
 * Dibuja el grafo (personas + ciudades) en pantalla usando D3
 * (force-directed graph): cada vez que el grafo cambia en GraphService,
 * este componente vuelve a renderizar el SVG.
 */
@Component({
  selector: 'app-graph-view',
  standalone: true,
  imports: [],
  templateUrl: './graph-view.component.html',
  styleUrl: './graph-view.component.scss',
})
export class GraphViewComponent implements AfterViewInit, OnDestroy {
  private graphService = inject(GraphService);
  private svgRef = viewChild.required<ElementRef<SVGSVGElement>>('svgEl');

  private simulation: d3.Simulation<SimNode, SimLink> | null = null;
  private ready = false;

  constructor() {
    effect(() => {
      // Dependencias reactivas: cualquier cambio en nodos o aristas redibuja.
      const nodos = this.graphService.nodes();
      const aristas = this.graphService.edges();
      if (this.ready) {
        this.render(nodos, aristas);
      }
    });
  }

  ngAfterViewInit(): void {
    this.ready = true;
    this.render(this.graphService.nodes(), this.graphService.edges());
  }

  ngOnDestroy(): void {
    this.simulation?.stop();
  }

  private render(
    nodosFuente: ReturnType<GraphService['nodes']>,
    aristasFuente: ReturnType<GraphService['edges']>,
  ): void {
    const svgEl = this.svgRef().nativeElement;
    const svg = d3.select(svgEl);
    svg.selectAll('*').remove();

    const width = svgEl.clientWidth || 600;
    const height = svgEl.clientHeight || 420;

    if (nodosFuente.length === 0) {
      this.simulation?.stop();
      return;
    }

    const nodes: SimNode[] = nodosFuente.map((n) => ({ id: n.id, data: n.data }));
    const links: SimLink[] = aristasFuente.map(([source, target]) => ({ source, target }));

    this.simulation?.stop();
    this.simulation = d3
      .forceSimulation<SimNode>(nodes)
      .force(
        'link',
        d3
          .forceLink<SimNode, SimLink>(links)
          .id((d) => d.id)
          .distance(90),
      )
      .force('charge', d3.forceManyBody().strength(-220))
      .force('center', d3.forceCenter(width / 2, height / 2))
      .force('collision', d3.forceCollide().radius(32));

    const link = svg
      .append('g')
      .attr('stroke', '#b9c0c9')
      .attr('stroke-width', 1.5)
      .selectAll('line')
      .data(links)
      .join('line');

    const node = svg
      .append('g')
      .selectAll<SVGGElement, SimNode>('g')
      .data(nodes)
      .join('g')
      .attr('class', 'graph-node')
      .call(
        d3
          .drag<SVGGElement, SimNode>()
          .on('start', (event, d) => {
            if (!event.active) this.simulation?.alphaTarget(0.3).restart();
            d.fx = d.x;
            d.fy = d.y;
          })
          .on('drag', (event, d) => {
            d.fx = event.x;
            d.fy = event.y;
          })
          .on('end', (event, d) => {
            if (!event.active) this.simulation?.alphaTarget(0);
            d.fx = null;
            d.fy = null;
          }),
      );

    node
      .append('circle')
      .attr('r', (d) => (d.data.kind === 'city' ? 22 : 16))
      .attr('fill', (d) => (d.data.kind === 'city' ? '#f59e0b' : '#3b82f6'))
      .attr('stroke', '#fff')
      .attr('stroke-width', 2);

    node
      .append('text')
      .text((d) => (d.data.kind === 'city' ? '🏙️' : '🧑'))
      .attr('text-anchor', 'middle')
      .attr('dy', '0.35em')
      .attr('font-size', (d) => (d.data.kind === 'city' ? 16 : 13));

    node
      .append('text')
      .text((d) => (d.data.kind === 'city' ? d.data.name : `${d.data.name} (${d.data.age})`))
      .attr('text-anchor', 'middle')
      .attr('dy', (d) => (d.data.kind === 'city' ? 36 : 30))
      .attr('font-size', 11)
      .attr('fill', '#1c1c1c');

    this.simulation.on('tick', () => {
      link
        .attr('x1', (d) => (d.source as SimNode).x ?? 0)
        .attr('y1', (d) => (d.source as SimNode).y ?? 0)
        .attr('x2', (d) => (d.target as SimNode).x ?? 0)
        .attr('y2', (d) => (d.target as SimNode).y ?? 0);

      node.attr('transform', (d) => `translate(${d.x ?? 0},${d.y ?? 0})`);
    });
  }
}
