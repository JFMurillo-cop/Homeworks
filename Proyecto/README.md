# 🛍️ CampusMarket — Proyecto Final Angular

Tienda en línea del campus universitario: catálogo con buscador inteligente, carrito de compras,
pedidos con entrega a domicilio por la **ruta más corta** dentro del campus, seguimiento de pedidos
y **chat de soporte en tiempo real**. Incluye panel de administración para atender la cola de pedidos.

## 👥 Integrantes

| Nombre | Código | Rama | Aporte principal |
|---|---|---|---|
| Juan Felipe Murillo | 226530 | `feature/juan-murillo` | Arquitectura Angular, estructuras de datos, integración con Firebase (auth, Firestore, reglas), páginas y despliegue en Netlify |
| Nicolás García Torres | 2226092 | `feature/nicolas-garcia` | Propuesta gráfica en Figma (pantallas de inicio, catálogo, mapa, login y registro) |

## 🔗 Enlaces

- **Propuesta gráfica (Figma):** https://www.figma.com/design/FbV2Ph4X8Gh6huMS8ODgAZ/CampusMarket-%E2%80%93-Propuesta-gr%C3%A1fica?node-id=0-1&t=ZrcM2ziljV2aeSH9-1
- **Despliegue (Netlify):** https://campus-market-uao.netlify.app
- **Repositorio:** https://github.com/JFMurillo-cop/Homeworks/tree/main/Proyecto
- **Documento final:** [docs/DOCUMENTO_FINAL.pdf](docs/DOCUMENTO_FINAL.pdf) (versión Markdown: [docs/DOCUMENTO_FINAL.md](docs/DOCUMENTO_FINAL.md))

## 🧰 Tecnologías

- Angular 22 (componentes standalone, signals, control flow `@if/@for`, lazy loading)
- Angular Router con guards (`authGuard`, `adminGuard`, `guestGuard`)
- Firebase Authentication (registro e inicio de sesión reales)
- Cloud Firestore (base de datos en tiempo real, transacciones)
- Netlify (despliegue del frontend)
- Vitest (pruebas unitarias de las estructuras de datos)
- Figma (propuesta gráfica)
- Claude Code: asistente de IA usado como apoyo en el desarrollo (detalle en el documento final, sección 2.1)

## 🧱 Estructuras de datos

| Estructura | Archivo | Dónde se usa |
|---|---|---|
| Lista enlazada | `core/data-structures/linked-list.ts` | Ítems del carrito |
| Pila | `core/data-structures/stack.ts` | "Deshacer" en el carrito |
| Cola | `core/data-structures/queue.ts` | Cola FIFO de pedidos pendientes (admin) |
| Trie | `core/data-structures/trie.ts` | Autocompletado y búsqueda del catálogo |
| Heap | `core/data-structures/heap.ts` | Ranking "Más vendidos" y cola de prioridad de Dijkstra |
| Grafo | `core/data-structures/graph.ts` | Mapa del campus y ruta de entrega más corta |

La explicación detallada está en el [documento final](docs/DOCUMENTO_FINAL.md).

## 🚀 Cómo ejecutarlo

```bash
npm install
npm start          # http://localhost:4200
npm test           # pruebas de las estructuras de datos
npm run build      # build de producción en dist/campus-market/browser
```

### Configurar Firebase

1. Crea un proyecto en [Firebase Console](https://console.firebase.google.com).
2. **Authentication → Método de acceso →** habilita *Correo electrónico/contraseña*.
3. **Firestore Database →** crea la base de datos y pega el contenido de [`firestore.rules`](firestore.rules) en la pestaña *Reglas*.
4. **Configuración del proyecto → Tus apps → Web**: copia el `firebaseConfig` en
   [`src/environments/environment.ts`](src/environments/environment.ts).
5. Regístrate en la app. Para volverte administrador, en Firestore abre `users/{tu uid}` y cambia
   `role` a `"admin"`.
6. Entra a **Panel admin** y pulsa **Cargar catálogo** para subir los productos a Firestore.

Sin el paso 4 la app funciona en modo de solo lectura (catálogo de ejemplo, mapa y buscador).

### Desplegar en Netlify

El archivo [`netlify.toml`](netlify.toml) ya define el comando de build, la carpeta a publicar y la
redirección SPA. Conecta el repositorio en Netlify (*Add new site → Import from Git*), selecciona la
carpeta base `Proyecto` si el repositorio la contiene, y despliega.

## 🗺️ Rutas

| Ruta | Acceso | Descripción |
|---|---|---|
| `/` | Pública | Inicio + más vendidos |
| `/catalogo` | Pública | Catálogo con buscador, filtros y orden |
| `/producto/:id` | Pública | Detalle de producto |
| `/mapa` | Pública | Mapa del campus y cálculo de rutas |
| `/login`, `/registro` | Solo invitados | Autenticación |
| `/carrito`, `/checkout`, `/mis-pedidos`, `/soporte` | Privada (sesión) | Compra, pedidos y chat |
| `/admin`, `/admin/chat/:uid` | Privada (rol admin) | Gestión de pedidos y soporte |
