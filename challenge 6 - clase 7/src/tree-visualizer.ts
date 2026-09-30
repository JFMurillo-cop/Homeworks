import * as d3 from 'd3';
import { Nodo } from './binary-tree';

// Estructura que espera d3.hierarchy: cada nodo con su "children"
interface D3TreeData {
  name: string;
  children?: D3TreeData[];
}

// Convierte nuestro Nodo (izquierda/derecha) al formato que necesita d3-hierarchy
function toD3Data(nodo: Nodo | null): D3TreeData | null {
  if (!nodo) return null;

  const children: D3TreeData[] = [];
  const left = toD3Data(nodo.izquierda);
  const right = toD3Data(nodo.derecha);
  if (left) children.push(left);
  if (right) children.push(right);

  return {
    name: String(nodo.valor),
    children: children.length > 0 ? children : undefined
  };
}

// Punto 3: dibuja el árbol usando d3-hierarchy + d3.tree()
export function drawTree(containerSelector: string, raiz: Nodo | null): void {
  const container = document.querySelector(containerSelector) as HTMLElement;
  container.innerHTML = '';

  const data = toD3Data(raiz);
  if (!data) return;

  const width = 700;
  const height = 380;
  const margin = { top: 40, right: 40, bottom: 40, left: 40 };

  const root = d3.hierarchy<D3TreeData>(data);

  const treeLayout = d3
    .tree<D3TreeData>()
    .size([width - margin.left - margin.right, height - margin.top - margin.bottom]);

  treeLayout(root);

  const svg = d3
    .select(container)
    .append('svg')
    .attr('width', width)
    .attr('height', height);

  const g = svg.append('g').attr('transform', `translate(${margin.left},${margin.top})`);

  // Enlaces (líneas entre nodos padre-hijo)
  g.selectAll('path.link')
    .data(root.links())
    .join('path')
    .attr('class', 'link')
    .attr('fill', 'none')
    .attr('stroke', '#9aa5d1')
    .attr('stroke-width', 1.5)
    .attr(
      'd',
      d3
        .linkVertical<d3.HierarchyPointLink<D3TreeData>, d3.HierarchyPointNode<D3TreeData>>()
        .x(d => d.x)
        .y(d => d.y) as any
    );

  // Nodos
  const node = g
    .selectAll('g.node')
    .data(root.descendants())
    .join('g')
    .attr('class', 'node')
    .attr('transform', d => `translate(${(d as any).x},${(d as any).y})`);

  node
    .append('circle')
    .attr('r', 18)
    .attr('fill', '#3f51b5')
    .attr('stroke', '#28348a')
    .attr('stroke-width', 1.5);

  node
    .append('text')
    .attr('dy', '0.32em')
    .attr('text-anchor', 'middle')
    .attr('fill', 'white')
    .style('font-size', '13px')
    .style('font-family', 'sans-serif')
    .text(d => d.data.name);
}
