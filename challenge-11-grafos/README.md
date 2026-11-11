# Challenge 11 - Grafo de amigos y ciudades

## Correr el proyecto
```bash
npm install
npm start
```

## Qué incluye
- **Grafo no dirigido implementado desde cero** (`src/app/models/graph.ts`), sin ninguna librería de grafos: `addNode`, `addEdge`, `searchNode`, `printAdjacency`, `isEmpty`, `removeNode`, `print` — igual a los métodos vistos en clase.
- Cada **persona** es un nodo (`name`, `age`) y queda referenciada (conectada por una arista) a **una ciudad**, que también es un nodo (`name`).
- **Personas por ciudad**: selecciona una ciudad y se listan las personas conectadas a ella (`GraphService.peopleInCity`, que usa `printAdjacency` por debajo).
- **Visualización con D3** (`d3-force`): el grafo completo se dibuja en pantalla como un force-directed graph, con las ciudades en naranja y las personas en azul; los nodos se pueden arrastrar.
- Botón "Imprimir grafo en consola" -> llama a `Graph.print()` (abre la consola del navegador para verlo).
