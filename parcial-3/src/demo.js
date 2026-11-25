// Demo por consola:  node src/demo.js
import { Trie } from "./Trie.js";
import { MaxHeap } from "./MaxHeap.js";
import { Graph } from "./Graph.js";
import { songs, similarities } from "./data.js";

const trie = new Trie();
const heap = new MaxHeap();
const graph = new Graph();

songs.forEach(({ title, plays }) => {
  trie.insert(title);
  heap.insert(title, plays);
  graph.addVertex(title);
});
similarities.forEach(([a, b]) => graph.addEdge(a, b));

console.log("=== 1. TRIE: buscador predictivo ===");
console.log('¿Existe "SICKO MODE"?     ', trie.search("SICKO MODE"));
console.log('¿Existe "sicko mode" (min)?', trie.search("sicko mode"));
console.log('¿Existe "Yesterday"?      ', trie.search("Yesterday"));
console.log('Sugerencias "b":  ', trie.suggest("b"));
console.log('Sugerencias "bl": ', trie.suggest("bl"));
console.log('Sugerencias "d":  ', trie.suggest("d"));
console.log('Sugerencias "zz": ', trie.suggest("zz"));

console.log("\n=== 2. MAX HEAP: TOP 5 más escuchadas ===");
heap.topK(5).forEach((s, i) => console.log(`${i + 1}. ${s.title} - ${s.plays}`));
heap.addPlays("Dákiti", 5000);
console.log('\nTras sumar 5000 reproducciones a "Dákiti":');
heap.topK(3).forEach((s, i) => console.log(`${i + 1}. ${s.title} - ${s.plays}`));

console.log("\n=== 3. GRAFO NO DIRIGIDO: recomendaciones ===");
console.log('Similares directas a "FE!N":', graph.neighbors("FE!N"));
console.log('Recomendaciones (BFS, prof. 2) para "Stronger":');
graph.recommend("Stronger", 2).forEach((r) =>
  console.log(`  - ${r.title} (distancia ${r.distance})`)
);
