# Parcial 3 – Spotify for Education · Panel de rankings

Mini plataforma de música educativa construida con estructuras de datos avanzadas.

## Requerimientos y dónde están

| Requerimiento | Estructura | Archivo |
|---|---|---|
| Buscador predictivo: insertar, buscar si existe y sugerir por prefijo | **Trie** | `src/Trie.js` |
| Ranking de canciones más escuchadas (TOP) | **Max Heap** | `src/MaxHeap.js` |
| Recomendación de canciones relacionadas | **Grafo no dirigido** (lista de adyacencia + BFS) | `src/Graph.js` |
| Panel visual con estilos reutilizables | **Sass** (variables, mapas, mixins, `@extend`, `@each`, `@for`) | `scss/` |

- `src/data.js`: catálogo de ejemplo (canciones, cantantes, géneros y similitudes).
- `src/app.js`: conecta las estructuras con el panel.
- `src/demo.js`: prueba de las tres estructuras por consola.

## Cómo ejecutarlo

```bash
npm install
npm run demo      # prueba por consola
npm run sass      # compila scss/ -> css/main.css
npx serve .       # abrir http://localhost:3000
```

El panel usa módulos de JavaScript, así que se debe abrir con un servidor local (no con doble clic en `index.html`).
