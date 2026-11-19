# Documento final — CampusMarket

## 1. Descripción y alcance del sistema

**CampusMarket** es una tienda en línea para la comunidad de un campus universitario. Permite comprar
productos de cafetería, papelería, tecnología y ropa, y recibirlos en cualquier edificio del campus.

### Alcance

**Usuarios invitados (zona pública)**
- Ver la página de inicio con el ranking de productos más vendidos.
- Explorar el catálogo: búsqueda con autocompletado, filtro por categoría y orden por precio o ventas.
- Ver el detalle de cada producto.
- Consultar el mapa de entregas del campus y calcular la ruta más corta, su costo y su tiempo.
- Registrarse e iniciar sesión.

**Clientes registrados (zona privada, protegida con `authGuard`)**
- Carrito de compras persistente con opción de **deshacer** la última acción.
- Checkout: elegir el punto de entrega en el mapa; el costo del domicilio se calcula según la
  distancia de la ruta más corta.
- Confirmar el pedido mediante una **transacción** que valida y descuenta el stock de forma atómica.
- Seguimiento de pedidos **en tiempo real** (pendiente → preparando → en camino → entregado).
- **Chat de soporte en tiempo real** con el equipo de la tienda.

**Administradores (zona privada, protegida con `adminGuard`)**
- Indicadores: pedidos en cola, en proceso, totales y ventas.
- **Cola FIFO** de pedidos pendientes con el botón "Atender siguiente".
- Avance del estado de los pedidos en proceso.
- Ranking de productos más vendidos.
- Bandeja de conversaciones de soporte y respuesta en tiempo real.
- Carga inicial del catálogo en la base de datos.

### Fuera del alcance
- Pasarela de pagos (el pago es contra entrega).
- Gestión de inventario con formularios (el catálogo se carga desde un archivo semilla).
- Seguimiento GPS del domiciliario.

## 2. Tecnologías utilizadas

| Tecnología | Uso |
|---|---|
| **Angular 22** | Framework del frontend: componentes standalone, *signals*, `input()/output()/model()`, control flow `@if/@for`, formularios reactivos, *lazy loading* de rutas. |
| **Angular Router** | Navegación; los menús públicos y privados se protegen con los guards `authGuard`, `adminGuard` y `guestGuard`. `withComponentInputBinding` entrega parámetros de ruta como inputs. |
| **Firebase Authentication** | Registro e inicio de sesión reales con correo y contraseña. |
| **Cloud Firestore** | Base de datos NoSQL en tiempo real (`onSnapshot`) para productos, pedidos, usuarios y chat. Las compras usan `runTransaction`; el chat usa `writeBatch`. |
| **Reglas de Firestore** | Seguridad del lado del servidor: cada usuario solo lee sus pedidos y su chat; nadie puede darse rol admin; el stock no puede quedar negativo. |
| **SCSS** | Estilos con *design tokens* (variables CSS) alineados con la propuesta gráfica. |
| **Vitest** | Pruebas unitarias de las estructuras de datos. |
| **Netlify** | Despliegue del frontend (ver `netlify.toml`). |
| **Figma** | Propuesta gráfica de las pantallas principales. |
| **Claude Code (IA de Anthropic)** | Asistente de programación usado durante el desarrollo (ver sección 2.1). |

### 2.1 Uso de inteligencia artificial

Durante el desarrollo se utilizó **Claude Code**, un asistente de programación con IA, como
herramienta de apoyo. Se usó para:

- Generar la estructura inicial del proyecto Angular y buena parte del código: componentes,
  servicios, guards y las implementaciones de las estructuras de datos con sus pruebas.
- Proponer el modelo de datos de Firestore, sus reglas de seguridad y la transacción de compra.
- Diagnosticar y corregir errores de compilación, de configuración y de despliegue.
- Resolver dudas técnicas de frontend (Angular, signals, router) y backend (Firebase, Netlify).
- Redactar la primera versión de la documentación.

El equipo definió la idea y el alcance del sistema, configuró los servicios (proyecto de Firebase,
autenticación, base de datos, reglas y despliegue en Netlify), probó la aplicación de punta a punta,
pidió y validó los ajustes de diseño y funcionamiento, organizó el trabajo en ramas y elaboró la
propuesta gráfica en Figma.

### Organización del proyecto

```
src/app/
├── core/                      # Lógica sin interfaz (singletons)
│   ├── data-structures/       # Lista, Pila, Cola, Trie, Heap, Grafo + pruebas
│   ├── data/                  # Catálogo semilla y mapa del campus
│   ├── guards/                # authGuard, adminGuard, guestGuard
│   ├── models/                # Interfaces (Product, Order, CartItem, ...)
│   └── services/              # Firebase, Auth, Productos, Carrito, Pedidos, Chat, Entregas
├── shared/                    # Componentes reutilizables (hijos)
│   ├── components/            # navbar, footer, product-card, search-box, campus-map, chat-window, toasts
│   └── pipes/                 # cop (formato de pesos colombianos)
└── features/                  # Páginas (componentes padre), cargadas con lazy loading
    ├── public/                # home, catalog, product-detail, delivery-map, not-found
    ├── auth/                  # login, register
    ├── private/               # cart (+ cart-item), checkout, orders, support
    └── admin/                 # dashboard, admin-chat
```

**Relación padre–hijo (ejemplos):**
- `Catalog` (padre) → `SearchBox` con binding bidireccional `[(query)]` y `ProductCard` con `[product]` / `(add)`.
- `Cart` (padre) → `CartItemRow` con `[item]`, `(quantityChange)`, `(remove)`.
- `Checkout` y `DeliveryMap` (padres) → `CampusMap` con `[selected]`, `[route]`, `(pick)`.
- `Support` y `AdminChat` (padres) → `ChatWindow` reutilizado con `[threadId]`.

## 3. Estructuras de datos

Todas están implementadas desde cero en `src/app/core/data-structures/` y probadas en
`data-structures.spec.ts`.

### 3.1 Lista enlazada — Carrito de compras
**Archivo:** `linked-list.ts` · **Usada en:** `CartService`

El carrito es una secuencia de ítems que crece al final, se recorre en el orden en que el usuario
agregó los productos y permite quitar cualquier ítem.

**¿Por qué?** La lista enlazada con puntero a la cola permite agregar al final en **O(1)** y eliminar
un nodo sin desplazar los demás elementos. Además, el carrito siempre se recorre completo (para
mostrarlo y sumar el total), que es justo la operación natural de una lista.

### 3.2 Pila — Deshacer en el carrito
**Archivo:** `stack.ts` · **Usada en:** `CartService.undo()`

Antes de cada cambio (agregar, quitar, cambiar cantidad, vaciar) se apila una copia del estado del
carrito. "Deshacer" hace `pop()` y restaura ese estado.

**¿Por qué?** Deshacer es por definición **LIFO**: la última acción hecha es la primera en revertirse.
La pila tiene un tamaño máximo (20) para no consumir memoria sin límite.

### 3.3 Cola — Pedidos pendientes
**Archivo:** `queue.ts` · **Usada en:** `Dashboard` (admin)

Los pedidos con estado `pendiente` se encolan por fecha de creación. El botón "Atender siguiente"
toma el frente de la cola y lo pasa a `preparando`. La cola se reconstruye cada vez que Firestore
avisa un cambio en tiempo real.

**¿Por qué?** Atender pedidos es un proceso justo de **FIFO**: el primero que pidió es el primero en
ser atendido. Está implementada con nodos enlazados para que `enqueue` y `dequeue` sean **O(1)**
(un arreglo con `shift()` sería O(n)).

### 3.4 Trie — Buscador con autocompletado
**Archivo:** `trie.ts` · **Usado en:** `ProductService.search()`, `SearchBox`

Cada palabra del nombre y la categoría de los productos se inserta en el trie (normalizada sin
tildes ni mayúsculas) junto con el id del producto. Al escribir, se sugieren las palabras que
empiezan con el prefijo y se filtran los productos cuyas palabras coinciden.

**¿Por qué?** Buscar un prefijo cuesta **O(L)** (L = largo de lo escrito), independiente del número
de productos, y el trie entrega todas las palabras que comparten ese prefijo recorriendo un solo
subárbol: exactamente lo que necesita un autocompletado. Así, "caf" encuentra "Café americano".

### 3.5 Heap (montículo) — Más vendidos y Dijkstra
**Archivo:** `heap.ts` · **Usado en:** `ProductService.topSellers()` y `Graph.shortestPath()`

- **MaxHeap** por unidades vendidas: alimenta el ranking "Más vendidos" del inicio y del panel admin.
- **MinHeap** por distancia: es la cola de prioridad del algoritmo de Dijkstra.

**¿Por qué?** Obtener los *k* mayores cuesta **O(k log n)** sin ordenar todo el catálogo, y en
Dijkstra el heap permite extraer en **O(log n)** el vértice no visitado más cercano, que es la
operación que más se repite en el algoritmo.

### 3.6 Grafo — Mapa de entregas del campus
**Archivo:** `graph.ts` · **Datos:** `core/data/campus-map.ts` · **Usado en:** `DeliveryService`, `CampusMap`

Los edificios del campus son **vértices** y los caminos entre ellos son **aristas ponderadas** con su
distancia en metros (grafo no dirigido, lista de adyacencia). Con **Dijkstra** se calcula la ruta
más corta desde la tienda hasta el punto de entrega; con la distancia se obtiene:
- Costo del domicilio = $1.000 + $500 por cada 100 m.
- Tiempo estimado = distancia / 70 m por minuto.

La ruta se dibuja resaltada en el mapa SVG y se guarda en el pedido.

**¿Por qué?** Un mapa de caminos es naturalmente un grafo, y "¿cuál es el camino más corto?" es el
problema clásico que Dijkstra resuelve en **O((V + E) log V)**. La lista de adyacencia es eficiente
porque cada edificio se conecta solo con unos pocos vecinos.

## 4. Base de datos y tiempo real

**Colecciones de Firestore**

| Colección | Contenido |
|---|---|
| `users/{uid}` | Nombre, correo y rol (`customer` / `admin`). |
| `products/{id}` | Nombre, precio, categoría, stock y unidades vendidas. |
| `orders/{id}` | Cliente, ítems, total, punto de entrega, ruta calculada y estado. |
| `chats/{uid}` | Resumen de la conversación de soporte del usuario. |
| `chats/{uid}/messages/{id}` | Mensajes del chat. |

**Transacción de compra (`OrderService.placeOrder`)**
1. Lee el stock actual de cada producto del carrito.
2. Si alguno no alcanza, cancela toda la operación y avisa al usuario.
3. Descuenta el stock, suma las ventas y crea el pedido, todo de forma atómica.

Así dos clientes que compran el último producto al mismo tiempo no pueden dejar el stock negativo.

**Tiempo real:** catálogo (stock y ventas), pedidos del cliente, cola del admin, bandeja de chats y
mensajes usan `onSnapshot`, por lo que se actualizan sin recargar la página.

## 5. Pruebas

```bash
npm test
```

Pruebas unitarias de las seis estructuras: inserción/eliminación en la lista, LIFO y tamaño máximo
de la pila, FIFO de la cola, autocompletado del trie sin tildes, orden del heap (max y min) y
Dijkstra/BFS del grafo, incluyendo casos sin camino.
