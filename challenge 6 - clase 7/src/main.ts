import './style.css';
import { ArbolBinario } from './binary-tree';
import { drawTree } from './tree-visualizer';

// ---------------------------------------------------
// Punto 1: Insertar una serie de números y recorrer
// ---------------------------------------------------
const arbol = new ArbolBinario();
const valores = [25, 15, 50, 10, 22, 35, 70, 4, 12, 18, 24, 31, 44, 66, 90];

arbol.insertarVarios(valores);

console.log('Valores insertados:', valores);
console.log('PreOrder:', arbol.preorden().join(', '));
console.log('InOrder:', arbol.inorden().join(', '));
console.log('PostOrder:', arbol.postorden().join(', '));

// ---------------------------------------------------
// Punto 2: función para verificar si un valor está en el árbol
// ---------------------------------------------------
console.log('¿Contiene 44?', arbol.contiene(44));
console.log('¿Contiene 100?', arbol.contiene(100));

// ---------------------------------------------------
// UI: mostrar los recorridos en pantalla + buscador interactivo
// ---------------------------------------------------
const app = document.querySelector<HTMLDivElement>('#app')!;
app.innerHTML = `
  <h1>Challenge 06 - Árbol Binario</h1>

  <section>
    <h2>Valores insertados</h2>
    <p class="values">${valores.join(', ')}</p>
  </section>

  <section class="traversals">
    <div>
      <h3>PreOrder</h3>
      <p>${arbol.preorden().join(' → ')}</p>
    </div>
    <div>
      <h3>InOrder</h3>
      <p>${arbol.inorden().join(' → ')}</p>
    </div>
    <div>
      <h3>PostOrder</h3>
      <p>${arbol.postorden().join(' → ')}</p>
    </div>
  </section>

  <section>
    <h2>Buscar un valor en el árbol</h2>
    <div class="search-box">
      <input id="search-input" type="number" placeholder="Ej: 44" />
      <button id="search-btn">Buscar</button>
    </div>
    <p id="search-result"></p>
  </section>

  <section>
    <h2>Visualización del árbol (D3)</h2>
    <div id="tree-container"></div>
  </section>
`;

// ---------------------------------------------------
// Punto 3: dibujar el árbol con d3
// (debe ir DESPUÉS de crear #tree-container con innerHTML)
// ---------------------------------------------------
drawTree('#tree-container', arbol.raiz);

const searchInput = document.querySelector<HTMLInputElement>('#search-input')!;
const searchBtn = document.querySelector<HTMLButtonElement>('#search-btn')!;
const searchResult = document.querySelector<HTMLParagraphElement>('#search-result')!;

searchBtn.addEventListener('click', () => {
  const valor = Number(searchInput.value);
  if (Number.isNaN(valor) || searchInput.value.trim() === '') {
    searchResult.textContent = 'Ingresa un número válido.';
    searchResult.className = '';
    return;
  }

  const existe = arbol.contiene(valor);
  console.log(`¿Contiene ${valor}?`, existe);
  searchResult.textContent = existe
    ? `✅ El valor ${valor} SÍ está en el árbol.`
    : `❌ El valor ${valor} NO está en el árbol.`;
  searchResult.className = existe ? 'found' : 'not-found';
});