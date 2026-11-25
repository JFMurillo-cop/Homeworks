# Parcial 3 – Estructuras de datos

**Spotify for Education · Panel de rankings**: mini plataforma de música educativa que usa estructuras de datos avanzadas.

Todo el proyecto está en la carpeta [`parcial-3/`](parcial-3/).

## Qué incluye

| Requerimiento | Estructura | Archivo |
|---|---|---|
| Buscador predictivo de canciones (insertar, buscar si existe, sugerencias por prefijo) | Trie | [`parcial-3/src/Trie.js`](parcial-3/src/Trie.js) |
| Ranking de canciones más escuchadas (TOP) | Max Heap | [`parcial-3/src/MaxHeap.js`](parcial-3/src/MaxHeap.js) |
| Recomendación de canciones relacionadas | Grafo no dirigido | [`parcial-3/src/Graph.js`](parcial-3/src/Graph.js) |
| Panel visual de rankings con estilos reutilizables | Sass | [`parcial-3/scss/`](parcial-3/scss/) |

## Cómo ejecutarlo

```bash
cd parcial-3
npm install
npm run demo      # prueba de las estructuras por consola
npx serve .       # abrir el panel en http://localhost:3000
```

Más detalles en [`parcial-3/README.md`](parcial-3/README.md).

---

Juan Felipe Murillo
