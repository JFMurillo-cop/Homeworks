import { useCallback, useEffect, useRef, useState } from 'react';
import { type Gif, GiphyError, isAbort, searchGifs } from '../giphy';

type Status = 'idle' | 'loading' | 'success' | 'error';

/**
 * Busca GIFs cada vez que cambia `query`.
 *  - Cancela la petición anterior (AbortController) si la búsqueda cambia o se desmonta el componente.
 *  - Guarda en memoria las primeras páginas para no repetir peticiones (la clave beta tiene límite).
 */
export function useGifSearch(query: string) {
  const [gifs, setGifs] = useState<Gif[]>([]);
  const [total, setTotal] = useState(0);
  const [status, setStatus] = useState<Status>('idle');
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState('');
  const cache = useRef(new Map<string, { gifs: Gif[]; total: number }>());
  const moreController = useRef<AbortController | null>(null);

  useEffect(() => {
    moreController.current?.abort();
    setError('');
    setLoadingMore(false);

    if (!query) {
      setGifs([]);
      setTotal(0);
      setStatus('idle');
      return;
    }

    const cached = cache.current.get(query);
    if (cached) {
      setGifs(cached.gifs);
      setTotal(cached.total);
      setStatus('success');
      return;
    }

    const controller = new AbortController();
    setStatus('loading');
    searchGifs(query, 0, controller.signal)
      .then((r) => {
        cache.current.set(query, r);
        setGifs(r.gifs);
        setTotal(r.total);
        setStatus('success');
      })
      .catch((e: unknown) => {
        if (isAbort(e)) return; // búsqueda reemplazada: se ignora
        setError(e instanceof GiphyError ? e.message : 'Ocurrió un error inesperado.');
        setStatus('error');
      });

    return () => controller.abort(); // cleanup: evita carreras y actualizar estado desmontado
  }, [query]);

  const loadMore = useCallback(async () => {
    if (!query || loadingMore) return;
    moreController.current?.abort();
    const controller = new AbortController();
    moreController.current = controller;
    setLoadingMore(true);
    try {
      const r = await searchGifs(query, gifs.length, controller.signal);
      setGifs((prev) => {
        const ids = new Set(prev.map((g) => g.id));
        return [...prev, ...r.gifs.filter((g) => !ids.has(g.id))];
      });
      setTotal(r.total);
    } catch (e) {
      if (!isAbort(e)) setError(e instanceof GiphyError ? e.message : 'Ocurrió un error inesperado.');
    } finally {
      if (moreController.current === controller) setLoadingMore(false);
    }
  }, [query, gifs.length, loadingMore]);

  return { gifs, total, status, error, loadingMore, loadMore, hasMore: gifs.length < total };
}
