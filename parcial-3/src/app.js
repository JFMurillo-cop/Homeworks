// Conecta las estructuras de datos con el panel visual de rankings
import { Trie } from "./Trie.js";
import { MaxHeap } from "./MaxHeap.js";
import { Graph } from "./Graph.js";
import { artists, songs, similarities } from "./data.js";

// ================= Estructuras =================
const trie = new Trie(); //   1. Buscador predictivo
const heap = new MaxHeap(); // 2. Ranking de populares
const graph = new Graph(); //  3. Recomendaciones (no dirigido)

const info = new Map(); // título -> { artist, cover, favorite }
const artistByName = new Map(artists.map((a) => [a.name, a]));

function addSong({ title, artist, plays }) {
  if (!trie.insert(title)) return false;
  heap.insert(title, plays);
  graph.addVertex(title);
  info.set(title, { artist, ...artistByName.get(artist) });
  return true;
}

// los datos vienen en miles de reproducciones
songs.forEach((s) => addSong({ ...s, plays: s.plays * 1000 }));
similarities.forEach(([a, b]) => graph.addEdge(a, b));

// ================= Utilidades =================
const $ = (id) => document.getElementById(id);
const esc = (s) => String(s).replace(/[&<>"']/g, (c) => `&#${c.charCodeAt(0)};`);
const fmt = (n) => n.toLocaleString("es-CO");
const initials = (t) =>
  t.replace(/[^\p{L}\p{N} ]/gu, "").split(" ").filter(Boolean).slice(0, 2).map((w) => w[0]).join("").toUpperCase() || "♪";
const cover = (cls, text) => `<div class="cover cover--${cls}">${esc(initials(text))}</div>`;
const star = (fav) => (fav ? `<span class="secret-star">★</span>` : "");

// ================= Estado =================
let filter = null; // null = todos, o un género musical
let current = null; // canción seleccionada / sonando

// ================= KPIs =================
function renderKpis() {
  const all = heap.topK(heap.size);
  $("kpiSongs").textContent = fmt(trie.size);
  $("kpiPlays").textContent = fmt(all.reduce((acc, s) => acc + s.plays, 0));
  $("kpiTop").textContent = heap.peek()?.title ?? "—";
}

// ================= Ranking (MAX HEAP) =================
// Lista de géneros sin repetir (en el orden en que aparecen)
const genres = () => [...new Set(artists.map((a) => a.genre))];

function renderFilters() {
  const pills = [{ name: null, label: "Todos" }, ...genres().map((g) => ({ name: g, label: g }))];
  $("filters").innerHTML = pills
    .map((p) => `<button class="pill ${filter === p.name ? "is-active" : ""}" data-genre="${esc(p.name ?? "")}">${esc(p.label)}</button>`)
    .join("");
}

$("filters").addEventListener("click", (e) => {
  const btn = e.target.closest("[data-genre]");
  if (!btn) return;
  filter = btn.dataset.genre || null;
  renderFilters();
  renderRanking();
});

function renderRanking() {
  // TOP 10 global con topK(); por género se extrae todo en orden y se filtra
  const list = filter
    ? heap.topK(heap.size).filter((s) => info.get(s.title).genre === filter)
    : heap.topK(10);
  const max = list[0]?.plays || 1;

  $("ranking").innerHTML = list
    .map((s, i) => {
      const d = info.get(s.title);
      return `<li class="ranking__item ${s.title === current ? "is-playing" : ""}" data-title="${esc(s.title)}">
        <span class="ranking__pos">${i + 1}</span>
        ${cover(d.cover, s.title)}
        <div class="ranking__info">
          <div class="ranking__title">${esc(s.title)}${star(d.favorite)}</div>
          <div class="ranking__artist">${esc(d.artist)} · ${esc(d.genre)}</div>
          <div class="ranking__bar"><div class="ranking__fill" style="width:${(s.plays / max) * 100}%"></div></div>
        </div>
        <span class="ranking__plays">${fmt(s.plays)}</span>
        <button class="play-btn" title="Reproducir (+1)" data-play="${esc(s.title)}">▶</button>
      </li>`;
    })
    .join("");
}

$("ranking").addEventListener("click", (e) => {
  const playBtn = e.target.closest("[data-play]");
  if (playBtn) return play(playBtn.dataset.play);
  const row = e.target.closest("[data-title]");
  if (row) select(row.dataset.title);
});

// ================= Reproducir / seleccionar =================
// Reproducir suma +1 al heap (se reordena con siftUp)
function play(title) {
  heap.addPlays(title, 1);
  select(title);
}

function select(title) {
  current = title;
  const d = info.get(title);

  // Easter egg: el panel cambia de acento si es un favorito
  const app = document.querySelector(".app");
  app.classList.remove("egg--travis", "egg--badbunny", "egg--kanye");
  if (d.favorite) app.classList.add(`egg--${d.cover}`);

  renderAll();
}

// ================= Recomendaciones (GRAFO) =================
function listItem(title, prefixLen = 0) {
  const d = info.get(title);
  const name = prefixLen
    ? `<mark>${esc(title.slice(0, prefixLen))}</mark>${esc(title.slice(prefixLen))}`
    : esc(title);
  return `<li class="list__item" data-title="${esc(title)}">
    ${cover(d.cover, title)}
    <div class="list__text">
      <div class="list__name">${name}${star(d.favorite)}</div>
      <div class="list__sub">${esc(d.artist)}</div>
    </div>
  </li>`;
}

function renderRecs() {
  if (!current) return;
  const d = info.get(current);
  $("now").innerHTML = `
    ${cover(d.cover, current)}
    <div>
      <div class="now__label">Seleccionada</div>
      <div class="now__title">${esc(current)}</div>
      <div class="now__artist">${esc(d.artist)} · ${esc(d.genre)}</div>
    </div>`;

  const recs = graph.recommend(current, 2); // BFS hasta distancia 2
  const empty = `<li class="list__empty">Sin conexiones todavía</li>`;
  $("recs1").innerHTML = recs.filter((r) => r.distance === 1).map((r) => listItem(r.title)).join("") || empty;
  $("recs2").innerHTML = recs.filter((r) => r.distance === 2).map((r) => listItem(r.title)).join("") || empty;
}

// ================= Buscador (TRIE) + easter eggs =================
const EGGS = [
  { keys: ["travis", "travis scott", "la flame", "cactus jack", "utopia", "astroworld"], artists: ["Travis Scott"], emoji: "🌵", title: "Cactus Jack desbloqueado", sub: "It's lit! Bienvenido a Utopia" },
  { keys: ["benito", "bad bunny", "bunny", "conejo", "conejo malo"], artists: ["Bad Bunny"], emoji: "🐰", title: "El Conejo Malo apareció", sub: "Debí tirar más fotos 📸" },
  { keys: ["ye", "kanye", "kanye west", "yeezy"], artists: ["Kanye West"], emoji: "🐻", title: "Yeezy season", sub: "College Dropout → Graduation 🎓" },
  { keys: ["goat", "goats", "favoritos", "los 3", "top 3"], artists: ["Travis Scott", "Bad Bunny", "Kanye West"], emoji: "🐐", title: "Los 3 GOATs del creador", sub: "Travis · Benito · Ye" },
];

function renderSearch() {
  const text = $("searchInput").value;
  const status = $("searchStatus");
  const list = $("suggestions");

  if (!text.trim()) {
    status.textContent = "";
    status.className = "search__status";
    list.innerHTML = "";
    return;
  }

  // Easter egg 🥚
  const egg = EGGS.find((e) => e.keys.includes(Trie.normalize(text)));
  if (egg) {
    status.className = "search__status";
    status.innerHTML = `<div class="egg-banner">
      <span class="egg-banner__emoji">${egg.emoji}</span>
      <div><div class="egg-banner__title">${egg.title}</div><div class="egg-banner__sub">${egg.sub}</div></div>
    </div>`;
    list.innerHTML = heap
      .topK(heap.size)
      .filter((s) => egg.artists.includes(info.get(s.title).artist))
      .map((s) => listItem(s.title))
      .join("");
    return;
  }

  // 2. ¿Existe la canción?  (Trie.search)
  const exists = trie.search(text);
  status.textContent = exists ? "✔ La canción existe en el catálogo" : "Sugerencias por prefijo";
  status.className = "search__status" + (exists ? " is-found" : "");

  // 3. Sugerencias por prefijo  (Trie.suggest)
  const results = trie.suggest(text, 6);
  list.innerHTML = results.length
    ? results.map((t) => listItem(t, text.trim().length)).join("")
    : `<li class="list__empty">✘ Ninguna canción empieza por "${esc(text.trim())}"</li>`;
  if (!results.length) status.className = "search__status is-missing";
}

$("searchInput").addEventListener("input", renderSearch);

// clic en sugerencias o recomendaciones -> seleccionar la canción
document.querySelectorAll("#suggestions, #recs1, #recs2").forEach((el) =>
  el.addEventListener("click", (e) => {
    const item = e.target.closest("[data-title]");
    if (item) select(item.dataset.title);
  })
);

// ================= 1. Insertar canción =================
// Busca un cantante sin importar mayúsculas ("bad bunny" = "Bad Bunny")
const findArtist = (name) => artists.find((a) => a.name.toLowerCase() === name.trim().toLowerCase());

// Si el cantante no existe se crea con su género y una portada de la paleta
// (Sass genera .cover--c1 ... .cover--c40 con @for)
function getOrCreateArtist(name, genre) {
  const found = findArtist(name);
  if (found) return { artist: found, isNew: false };

  const artist = { name: name.trim(), genre, cover: `c${(artists.length % 40) + 1}` };
  artists.push(artist);
  artistByName.set(artist.name, artist);
  return { artist, isNew: true };
}

const NEW_ARTIST = "__nuevo__";

// Selector: "Selecciona un cantante", los del catálogo agrupados por género
// y al final "+ Agregar cantante nuevo"
function fillArtistOptions() {
  const groups = genres()
    .map((g) => {
      const opts = artists.filter((a) => a.genre === g).map((a) => `<option value="${esc(a.name)}">${esc(a.name)}</option>`).join("");
      return `<optgroup label="${esc(g)}">${opts}</optgroup>`;
    })
    .join("");
  $("newArtist").innerHTML =
    `<option value="" disabled selected>Selecciona un cantante</option>` +
    groups +
    `<option value="${NEW_ARTIST}">＋ Agregar cantante nuevo…</option>`;

  $("newArtistGenre").innerHTML =
    `<option value="" disabled selected>Género del cantante nuevo</option>` +
    [...new Set([...genres(), "Otro"])].map((g) => `<option>${esc(g)}</option>`).join("");
}

// Si elige "Agregar cantante nuevo" aparece el campo para escribir el nombre
function toggleNewArtist() {
  const isNew = $("newArtist").value === NEW_ARTIST;
  $("newArtistName").hidden = !isNew;
  $("newArtistName").required = isNew;
  $("newArtistGenre").hidden = !isNew;
  $("newArtistGenre").required = isNew;
  if (isNew) $("newArtistName").focus();
  updateArtistHint();
}

// Aviso: si escribe uno que ya existe se le avisa que se usará ese
function updateArtistHint() {
  const hint = $("artistHint");
  const name = $("newArtistName").value.trim();
  if ($("newArtist").value !== NEW_ARTIST || !name) {
    hint.textContent = "";
    hint.className = "add-form__hint";
    return;
  }
  const found = findArtist(name);
  hint.textContent = found ? `"${found.name}" ya está en el catálogo, se usará ese` : `✚ "${name}" se agregará como cantante nuevo`;
  hint.className = "add-form__hint" + (found ? "" : " is-new");
}

// Reproducciones: acepta "56.640.568", "56,640,568" o "56640568"
// (se quitan los separadores y queda solo el número)
const parsePlays = (text) => Number(String(text).replace(/\D/g, "")) || 0;

// Mientras escribe: se permiten números, puntos y comas (lo demás se borra)
$("newPlays").addEventListener("input", (e) => {
  e.target.value = e.target.value.replace(/[^\d.,]/g, "");
});

// Al salir del campo se acomoda con los puntos de miles: 56640568 -> 56.640.568
$("newPlays").addEventListener("blur", (e) => {
  const n = parsePlays(e.target.value);
  e.target.value = e.target.value.trim() ? fmt(n) : "";
});

$("newArtist").addEventListener("change", toggleNewArtist);
$("newArtistName").addEventListener("input", updateArtistHint);

$("addForm").addEventListener("submit", (e) => {
  e.preventDefault();
  const title = $("newTitle").value.trim();
  const artistName = $("newArtist").value === NEW_ARTIST ? $("newArtistName").value.trim() : $("newArtist").value;
  const plays = parsePlays($("newPlays").value);
  const status = $("addStatus");
  if (!title || !artistName) return;

  // se revisa primero con el Trie para no crear un cantante en vano
  if (trie.search(title)) {
    status.textContent = `✘ "${title}" ya existe`;
    return;
  }

  const { artist, isNew } = getOrCreateArtist(artistName, $("newArtistGenre").value || "Otro");
  addSong({ title, artist: artist.name, plays });

  // se conecta en el grafo con la más escuchada del mismo cantante;
  // si el cantante es nuevo, con la más escuchada de su género
  const ordered = heap.topK(heap.size).filter((s) => s.title !== title);
  const same =
    ordered.find((s) => info.get(s.title).artist === artist.name) ??
    ordered.find((s) => info.get(s.title).genre === artist.genre);
  if (same) graph.addEdge(title, same.title);

  status.textContent = `✔ "${title}" de ${artist.name} agregada al catálogo` + (isNew ? " · cantante nuevo agregado" : "");
  e.target.reset();
  fillArtistOptions();
  toggleNewArtist();
  renderFilters();
  select(title);
});

fillArtistOptions();

// ================= Inicio =================
function renderAll() {
  renderKpis();
  renderRanking();
  renderRecs();
}

renderFilters();
current = heap.peek().title;
renderAll();
