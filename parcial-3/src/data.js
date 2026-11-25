// Datos de ejemplo de la plataforma
// plays = reproducciones en miles
// favorite = easter egg 🌵🐰🐻 (artistas favoritos del autor)

const rawArtists = [
  // Pop
  { name: "The Weeknd", genre: "Pop" },
  { name: "Dua Lipa", genre: "Pop" },
  { name: "Billie Eilish", genre: "Pop" },
  { name: "Taylor Swift", genre: "Pop" },
  // Rock
  { name: "Queen", genre: "Rock" },
  { name: "Arctic Monkeys", genre: "Rock" },
  { name: "Nirvana", genre: "Rock" },
  { name: "Guns N' Roses", genre: "Rock" },
  // Metal
  { name: "Metallica", genre: "Metal" },
  // Reggaetón
  { name: "Karol G", genre: "Reggaetón" },
  { name: "Feid", genre: "Reggaetón" },
  { name: "Bad Bunny", genre: "Reggaetón", favorite: true, cover: "badbunny" },
  // Hip-hop / Rap
  { name: "Kendrick Lamar", genre: "Hip-hop" },
  { name: "Travis Scott", genre: "Hip-hop", favorite: true, cover: "travis" },
  { name: "Kanye West", genre: "Hip-hop", favorite: true, cover: "kanye" },
  // Electrónica
  { name: "Daft Punk", genre: "Electrónica" },
  { name: "Avicii", genre: "Electrónica" },
  // Salsa
  { name: "Héctor Lavoe", genre: "Salsa" },
  { name: "Grupo Niche", genre: "Salsa" },
  // Vallenato
  { name: "Carlos Vives", genre: "Vallenato" },
  { name: "Silvestre Dangond", genre: "Vallenato" },
  // Bachata
  { name: "Romeo Santos", genre: "Bachata" },
  { name: "Aventura", genre: "Bachata" },
  // Regional mexicano
  { name: "Peso Pluma", genre: "Regional mexicano" },
  { name: "Vicente Fernández", genre: "Regional mexicano" },
  // K-pop
  { name: "BTS", genre: "K-pop" },
  { name: "BLACKPINK", genre: "K-pop" },
  { name: "aespa", genre: "K-pop" },
  { name: "LE SSERAFIM", genre: "K-pop" },
  { name: "MEOVV", genre: "K-pop" },
];

// Cada artista normal recibe una portada .cover--c1, c2, ... (generadas con @for en Sass)
export const artists = rawArtists.map((a, i) => ({ ...a, cover: a.cover ?? `c${i + 1}` }));

export const songs = [
  // Pop
  { title: "Blinding Lights", artist: "The Weeknd", plays: 4210 },
  { title: "Starboy", artist: "The Weeknd", plays: 3120 },
  { title: "Save Your Tears", artist: "The Weeknd", plays: 2650 },
  { title: "Levitating", artist: "Dua Lipa", plays: 2890 },
  { title: "Don't Start Now", artist: "Dua Lipa", plays: 2540 },
  { title: "Bad Guy", artist: "Billie Eilish", plays: 2600 },
  { title: "BIRDS OF A FEATHER", artist: "Billie Eilish", plays: 2950 },
  { title: "Cruel Summer", artist: "Taylor Swift", plays: 2480 },
  { title: "Anti-Hero", artist: "Taylor Swift", plays: 2150 },

  // Rock
  { title: "Bohemian Rhapsody", artist: "Queen", plays: 2780 },
  { title: "Don't Stop Me Now", artist: "Queen", plays: 2210 },
  { title: "Do I Wanna Know?", artist: "Arctic Monkeys", plays: 2720 },
  { title: "505", artist: "Arctic Monkeys", plays: 2380 },
  { title: "Smells Like Teen Spirit", artist: "Nirvana", plays: 2060 },
  { title: "Come As You Are", artist: "Nirvana", plays: 1290 },
  { title: "Sweet Child O' Mine", artist: "Guns N' Roses", plays: 2010 },

  // Metal
  { title: "Enter Sandman", artist: "Metallica", plays: 1450 },
  { title: "Nothing Else Matters", artist: "Metallica", plays: 1380 },

  // Reggaetón
  { title: "Bichota", artist: "Karol G", plays: 1640 },
  { title: "Provenza", artist: "Karol G", plays: 1820 },
  { title: "Normal", artist: "Feid", plays: 1390 },
  { title: "Classy 101", artist: "Feid", plays: 1210 },
  { title: "Tití Me Preguntó", artist: "Bad Bunny", plays: 2680 },
  { title: "Dákiti", artist: "Bad Bunny", plays: 2390 },
  { title: "DtMF", artist: "Bad Bunny", plays: 2100 },

  // Hip-hop
  { title: "HUMBLE.", artist: "Kendrick Lamar", plays: 2470 },
  { title: "Not Like Us", artist: "Kendrick Lamar", plays: 2330 },
  { title: "SICKO MODE", artist: "Travis Scott", plays: 2950 },
  { title: "goosebumps", artist: "Travis Scott", plays: 2410 },
  { title: "FE!N", artist: "Travis Scott", plays: 2230 },
  { title: "Burn This Shit Down", artist: "Travis Scott", plays: 3428 },
  { title: "Stronger", artist: "Kanye West", plays: 2260 },
  { title: "Flashing Lights", artist: "Kanye West", plays: 2050 },
  { title: "CARNIVAL", artist: "Kanye West", plays: 1920 },

  // Electrónica
  { title: "Get Lucky", artist: "Daft Punk", plays: 1980 },
  { title: "One More Time", artist: "Daft Punk", plays: 1730 },
  { title: "Wake Me Up", artist: "Avicii", plays: 2560 },
  { title: "Levels", artist: "Avicii", plays: 1240 },

  // Salsa
  { title: "El Cantante", artist: "Héctor Lavoe", plays: 980 },
  { title: "Periódico de Ayer", artist: "Héctor Lavoe", plays: 860 },
  { title: "Cali Pachanguero", artist: "Grupo Niche", plays: 940 },
  { title: "Una Aventura", artist: "Grupo Niche", plays: 1020 },

  // Vallenato
  { title: "La Gota Fría", artist: "Carlos Vives", plays: 890 },
  { title: "Volví a Nacer", artist: "Carlos Vives", plays: 1110 },
  { title: "Las Locuras Mías", artist: "Silvestre Dangond", plays: 760 },

  // Bachata
  { title: "Propuesta Indecente", artist: "Romeo Santos", plays: 1870 },
  { title: "Eres Mía", artist: "Romeo Santos", plays: 1430 },
  { title: "Obsesión", artist: "Aventura", plays: 1160 },

  // Regional mexicano
  { title: "Ella Baila Sola", artist: "Peso Pluma", plays: 2040 },
  { title: "LADY GAGA", artist: "Peso Pluma", plays: 1180 },
  { title: "Volver, Volver", artist: "Vicente Fernández", plays: 1300 },

  // K-pop
  { title: "Dynamite", artist: "BTS", plays: 2300 },
  { title: "Butter", artist: "BTS", plays: 1760 },
  { title: "How You Like That", artist: "BLACKPINK", plays: 1690 },
  { title: "Supernova", artist: "aespa", plays: 1580 },
  { title: "Whiplash", artist: "aespa", plays: 1340 },
  { title: "ANTIFRAGILE", artist: "LE SSERAFIM", plays: 1270 },
  { title: "EASY", artist: "LE SSERAFIM", plays: 1050 },
  { title: "MEOW", artist: "MEOVV", plays: 930 },
  { title: "TOXIC", artist: "MEOVV", plays: 810 },
];

// Pares de canciones similares (aristas del grafo NO dirigido)
export const similarities = [
  // Pop
  ["Blinding Lights", "Levitating"],
  ["Blinding Lights", "Save Your Tears"],
  ["Levitating", "Don't Start Now"],
  ["Bad Guy", "BIRDS OF A FEATHER"],
  ["Bad Guy", "Levitating"],
  ["Cruel Summer", "Anti-Hero"],
  ["Cruel Summer", "Don't Start Now"],
  ["BIRDS OF A FEATHER", "Anti-Hero"],
  // Rock / Metal
  ["Bohemian Rhapsody", "Don't Stop Me Now"],
  ["Bohemian Rhapsody", "Sweet Child O' Mine"],
  ["Do I Wanna Know?", "505"],
  ["505", "Come As You Are"],
  ["Smells Like Teen Spirit", "Come As You Are"],
  ["Smells Like Teen Spirit", "Enter Sandman"],
  ["Sweet Child O' Mine", "Enter Sandman"],
  ["Enter Sandman", "Nothing Else Matters"],
  // Reggaetón
  ["Bichota", "Provenza"],
  ["Provenza", "Normal"],
  ["Normal", "Classy 101"],
  ["Tití Me Preguntó", "Bichota"],
  ["Dákiti", "Classy 101"],
  ["DtMF", "Tití Me Preguntó"],
  // Hip-hop
  ["HUMBLE.", "Not Like Us"],
  ["HUMBLE.", "SICKO MODE"],
  ["SICKO MODE", "goosebumps"],
  ["SICKO MODE", "Burn This Shit Down"],
  ["FE!N", "Burn This Shit Down"],
  ["FE!N", "CARNIVAL"],
  ["Stronger", "Flashing Lights"],
  ["Flashing Lights", "Not Like Us"],
  // Electrónica
  ["Get Lucky", "One More Time"],
  ["Wake Me Up", "Levels"],
  ["Levels", "One More Time"],
  // Salsa
  ["El Cantante", "Periódico de Ayer"],
  ["Cali Pachanguero", "Una Aventura"],
  ["El Cantante", "Una Aventura"],
  // Vallenato
  ["La Gota Fría", "Volví a Nacer"],
  ["Volví a Nacer", "Las Locuras Mías"],
  // Bachata
  ["Propuesta Indecente", "Eres Mía"],
  ["Eres Mía", "Obsesión"],
  // Regional mexicano
  ["Ella Baila Sola", "LADY GAGA"],
  ["Ella Baila Sola", "Volver, Volver"],
  // K-pop
  ["Dynamite", "Butter"],
  ["Butter", "How You Like That"],
  ["Supernova", "Whiplash"],
  ["Supernova", "How You Like That"],
  ["ANTIFRAGILE", "EASY"],
  ["ANTIFRAGILE", "Whiplash"],
  ["MEOW", "TOXIC"],
  ["MEOW", "How You Like That"],
  ["TOXIC", "EASY"],

  // Puentes entre géneros (mismo vibe)
  ["Starboy", "One More Time"],
  ["Stronger", "One More Time"],
  ["goosebumps", "Starboy"],
  ["Don't Start Now", "Get Lucky"],
  ["Wake Me Up", "Blinding Lights"],
  ["Dynamite", "Levitating"],
  ["Dákiti", "Save Your Tears"],
  ["Una Aventura", "Volví a Nacer"],
  ["Propuesta Indecente", "Provenza"],
  ["Obsesión", "Una Aventura"],
  ["LADY GAGA", "Normal"],
  ["La Gota Fría", "Volver, Volver"],
];
