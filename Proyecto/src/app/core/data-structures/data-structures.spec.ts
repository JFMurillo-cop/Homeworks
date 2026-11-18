import { LinkedList } from './linked-list';
import { Stack } from './stack';
import { Queue } from './queue';
import { Trie } from './trie';
import { Heap } from './heap';
import { Graph } from './graph';

describe('LinkedList', () => {
  it('append, prepend, insertAt y toArray', () => {
    const list = new LinkedList<number>();
    list.append(2);
    list.append(3);
    list.prepend(1);
    list.insertAt(3, 4);
    list.insertAt(1, 9);
    expect(list.toArray()).toEqual([1, 9, 2, 3, 4]);
    expect(list.size).toBe(5);
  });

  it('remove actualiza head y tail', () => {
    const list = LinkedList.fromArray([1, 2, 3]);
    expect(list.remove((v) => v === 3)).toBe(3);
    list.append(4);
    expect(list.toArray()).toEqual([1, 2, 4]);
    list.remove((v) => v === 1);
    expect(list.toArray()).toEqual([2, 4]);
    expect(list.remove((v) => v === 99)).toBeUndefined();
    expect(list.find((v) => v > 2)).toBe(4);
    expect(list.indexOf((v) => v === 4)).toBe(1);
  });
});

describe('Stack', () => {
  it('es LIFO y respeta el tamaño máximo', () => {
    const stack = new Stack<number>(2);
    stack.push(1);
    stack.push(2);
    stack.push(3);
    expect(stack.size).toBe(2);
    expect(stack.pop()).toBe(3);
    expect(stack.peek()).toBe(2);
    expect(stack.pop()).toBe(2);
    expect(stack.pop()).toBeUndefined();
  });
});

describe('Queue', () => {
  it('es FIFO', () => {
    const queue = new Queue<string>();
    queue.enqueue('a');
    queue.enqueue('b');
    expect(queue.peek()).toBe('a');
    expect(queue.dequeue()).toBe('a');
    queue.enqueue('c');
    expect(queue.toArray()).toEqual(['b', 'c']);
    queue.dequeue();
    queue.dequeue();
    expect(queue.isEmpty()).toBe(true);
    expect(queue.dequeue()).toBeUndefined();
    queue.enqueue('d');
    expect(queue.toArray()).toEqual(['d']);
  });
});

describe('Trie', () => {
  it('autocompleta ignorando tildes y mayúsculas', () => {
    const trie = new Trie();
    trie.insertText('Café americano', 'p1');
    trie.insertText('Camiseta UAO', 'p2');
    trie.insertText('Calculadora', 'p3');
    expect(trie.autocomplete('ca')).toEqual(['cafe', 'calculadora', 'camiseta']);
    expect(trie.autocomplete('CAF')).toEqual(['cafe']);
    expect(trie.has('Americano')).toBe(true);
    expect(trie.startsWith('xyz')).toBe(false);
    expect([...trie.searchIds('ca')].sort()).toEqual(['p1', 'p2', 'p3']);
    expect(trie.searchIds('')).toEqual(new Set());
  });
});

describe('Heap', () => {
  it('MaxHeap entrega los mayores primero', () => {
    const heap = Heap.fromArray([5, 1, 9, 3, 7], (a, b) => b - a);
    expect(heap.top(3)).toEqual([9, 7, 5]);
    expect(heap.size).toBe(5); // top() no destruye el heap
    expect(heap.extract()).toBe(9);
    expect(heap.peek()).toBe(7);
  });

  it('MinHeap ordena ascendente', () => {
    const heap = Heap.fromArray([4, 2, 8, 6], (a, b) => a - b);
    const out: number[] = [];
    while (!heap.isEmpty()) out.push(heap.extract()!);
    expect(out).toEqual([2, 4, 6, 8]);
  });
});

describe('Graph', () => {
  const graph = new Graph();
  graph.addEdge('A', 'B', 4);
  graph.addEdge('A', 'C', 1);
  graph.addEdge('C', 'B', 2);
  graph.addEdge('B', 'D', 5);
  graph.addVertex('Z');

  it('Dijkstra encuentra la ruta más corta', () => {
    expect(graph.shortestPath('A', 'D')).toEqual({ path: ['A', 'C', 'B', 'D'], distance: 8 });
    expect(graph.shortestPath('A', 'A')).toEqual({ path: ['A'], distance: 0 });
  });

  it('devuelve null si no hay camino', () => {
    expect(graph.shortestPath('A', 'Z')).toBeNull();
    expect(graph.shortestPath('A', 'NOPE')).toBeNull();
  });

  it('BFS recorre los alcanzables', () => {
    expect(graph.bfs('A').sort()).toEqual(['A', 'B', 'C', 'D']);
  });
});
