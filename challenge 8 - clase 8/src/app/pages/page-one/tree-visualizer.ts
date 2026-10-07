import * as d3 from 'd3';

interface NodoLike {
  valor: number;
  izquierda: NodoLike | null;
  derecha: NodoLike | null;
}

interface D3TreeData {
  name: string;
  children?: D3TreeData[];
}

function toD3Data(nodo: NodoLike | null): D3TreeData | null {
  if (!nodo) return null;
  const children: D3TreeData[] = [];
  const left = toD3Data(nodo.izquierda);
  const right = toD3Data(nodo.derecha);
  if (left) children.push(left);
  if (right) children.push(right);
  return { name: String(nodo.valor), children: children.length > 0 ? children : undefined };
}

export function drawTree(containerSelector: string, raiz: NodoLike | null): void {
  const container = document.querySelector(containerSelector) as HTMLElement;
  if (!container) return;
  container.innerHTML = '';

  const data = toD3Data(raiz);
  if (!data) return;

  const width = 600;
  const height = 320;
  const margin = { top: 30, right: 30, bottom: 30, left: 30 };

  const root = d3.hierarchy<D3TreeData>(data);
  const treeLayout = d3
    .tree<D3TreeData>()
    .size([width - margin.left - margin.right, height - margin.top - margin.bottom]);
  treeLayout(root);

  const svg = d3.select(container).append('svg').attr('width', width).attr('height', height);
  const g = svg.append('g').attr('transform', `translate(${margin.left},${margin.top})`);

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

  const node = g
    .selectAll('g.node')
    .data(root.descendants())
    .join('g')
    .attr('class', 'node')
    .attr('transform', d => `translate(${(d as any).x},${(d as any).y})`);

  node
    .append('circle')
    .attr('r', 16)
    .attr('fill', '#3f51b5')
    .attr('stroke', '#28348a')
    .attr('stroke-width', 1.5);

  node
    .append('text')
    .attr('dy', '0.32em')
    .attr('text-anchor', 'middle')
    .attr('fill', 'white')
    .style('font-size', '12px')
    .style('font-family', 'sans-serif')
    .text(d => d.data.name);
}
