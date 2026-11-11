# Challenge 12 - Buscador inteligente (Trie + Heap)

## Correr el proyecto
```bash
npm install
npm start
```

## Qué incluye
- **Trie implementado desde cero** (`src/app/models/trie.ts`): cada nodo tiene un mapa de hijos (letra -> nodo) y una bandera `isEndOfWord`, igual a lo visto en clase. Cada producto (`{ name, popularity }`) se guarda en el nodo donde termina su nombre.
- **Búsqueda por prefijo**: `searchByPrefix(prefix)` camina letra por letra hasta el nodo del prefijo y luego recorre (DFS) todos sus descendientes recolectando los productos que empiezan por ese prefijo.
- **Heap implementado desde cero** (`src/app/models/heap.ts`): mismos métodos vistos en clase (`push`, `pop`, `peek`, `heapify`, `percolateUp`, `percolateDown`, `swap`, `size`, `toArray`), representado con un arreglo. Es genérico (recibe un comparador), y aquí se usa como **max-heap de popularidad** para resolver el Top K.
- `SearchEngineService.searchTopK(prefix, k)` combina ambos: busca las coincidencias en el Trie, las mete en el Heap, y hace `pop()` K veces para devolver los K más populares, de mayor a menor.
- Botón "Cargar ejemplo del reto" carga exactamente los datos de la diapositiva (`air max/90`, `air force/95`, `air jordan/85`, `adidas boost/80`) para comprobar que `searchTopK("air", 2)` devuelve `air force (95)` y `air max (90)`, igual que el ejemplo.
