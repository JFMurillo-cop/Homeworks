import { useState } from 'react';
import type { Gif } from './giphy';
import { useDebouncedValue } from './hooks/useDebouncedValue';
import { useGifSearch } from './hooks/useGifSearch';

const SUGGESTIONS = ['smile', 'cat', 'wow', 'party', 'thank you'];

function GifCard({ gif }: { gif: Gif }) {
  const [copied, setCopied] = useState(false);
  const img = gif.images.fixed_width;

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(gif.url);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      window.prompt('Copia el enlace:', gif.url);
    }
  }

  return (
    <li className="card">
      <a href={gif.url} target="_blank" rel="noreferrer" aria-label={`Abrir en GIPHY: ${gif.title || 'GIF'}`}>
        <img
          src={img.url}
          width={img.width}
          height={img.height}
          style={{ aspectRatio: `${img.width} / ${img.height}` }}
          alt={gif.title || 'GIF'}
          loading="lazy"
        />
      </a>
      <button type="button" className="copy" onClick={copyLink}>
        {copied ? '¡Copiado!' : 'Copiar enlace'}
      </button>
    </li>
  );
}

export default function App() {
  const [text, setText] = useState('');
  const query = useDebouncedValue(text.trim());
  const { gifs, total, status, error, loadingMore, loadMore, hasMore } = useGifSearch(query);

  const typing = text.trim() !== query; // el usuario escribió y aún no se lanzó la búsqueda

  return (
    <div className="page">
      <header className="top">
        <h1>Buscador de GIFs</h1>
        <p>Escribe una palabra y los resultados aparecen solos.</p>

        <div className="search">
          <input
            type="search"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Busca un GIF… por ejemplo: smile"
            aria-label="Buscar GIFs"
            autoFocus
          />
          {text && (
            <button type="button" className="clear" onClick={() => setText('')} aria-label="Borrar búsqueda">
              ×
            </button>
          )}
        </div>

        <div className="chips" aria-label="Sugerencias">
          {SUGGESTIONS.map((s) => (
            <button key={s} type="button" onClick={() => setText(s)}>
              {s}
            </button>
          ))}
        </div>
      </header>

      <main>
        <p className="status" role="status" aria-live="polite">
          {status === 'idle' && !typing && 'Todavía no has buscado nada.'}
          {(status === 'loading' || typing) && text.trim() && 'Buscando…'}
          {status === 'success' && !typing && gifs.length > 0 && `Mostrando ${gifs.length} de ${total} GIFs para “${query}”`}
          {status === 'success' && !typing && gifs.length === 0 && `No encontramos GIFs para “${query}”. Prueba con otra palabra.`}
        </p>

        {error && <p className="error" role="alert">{error}</p>}

        <ul className={`grid ${status === 'loading' || typing ? 'busy' : ''}`}>
          {gifs.map((g) => (
            <GifCard key={g.id} gif={g} />
          ))}
        </ul>

        {status === 'success' && hasMore && !typing && (
          <div className="more">
            <button type="button" onClick={loadMore} disabled={loadingMore}>
              {loadingMore ? 'Cargando…' : 'Cargar más'}
            </button>
          </div>
        )}
      </main>

      <footer>Powered by GIPHY</footer>
    </div>
  );
}
