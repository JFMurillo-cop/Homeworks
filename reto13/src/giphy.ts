// Cliente para el endpoint de búsqueda de GIPHY, hecho con fetch.
// La clave se lee de las variables de entorno (.env → VITE_GIPHY_API_KEY).

const SEARCH_URL = 'https://api.giphy.com/v1/gifs/search';
const API_KEY = import.meta.env.VITE_GIPHY_API_KEY;
const TIMEOUT_MS = 10_000;

export const PAGE_SIZE = 24;

export interface GifImage {
  url: string;
  width: string;
  height: string;
}

export interface Gif {
  id: string;
  title: string;
  url: string; // página del GIF en giphy.com
  images: { fixed_width: GifImage };
}

export interface SearchResult {
  gifs: Gif[];
  total: number;
}

export class GiphyError extends Error {
  constructor(
    message: string,
    public status?: number,
  ) {
    super(message);
    this.name = 'GiphyError';
  }
}

export const isAbort = (e: unknown) => e instanceof DOMException && e.name === 'AbortError';

export async function searchGifs(
  query: string,
  offset = 0,
  signal?: AbortSignal,
): Promise<SearchResult> {
  if (!API_KEY || API_KEY === 'PEGA_AQUI_TU_API_KEY') {
    throw new GiphyError(
      'Falta la API key. Pon tu clave en el archivo .env (VITE_GIPHY_API_KEY) y reinicia npm run dev.',
    );
  }

  const params = new URLSearchParams({
    api_key: API_KEY,
    q: query,
    limit: String(PAGE_SIZE),
    offset: String(offset),
    rating: 'g',
    lang: 'en',
  });

  // Cancela por el usuario (signal) o por tiempo de espera, lo que ocurra primero
  const timeout = AbortSignal.timeout(TIMEOUT_MS);
  const combined = signal ? AbortSignal.any([signal, timeout]) : timeout;

  let res: Response;
  try {
    res = await fetch(`${SEARCH_URL}?${params}`, { signal: combined });
  } catch (e) {
    if (e instanceof DOMException && e.name === 'TimeoutError') {
      throw new GiphyError('GIPHY tardó demasiado en responder. Intenta de nuevo.');
    }
    if (isAbort(e)) throw e;
    throw new GiphyError('No se pudo conectar. Revisa tu conexión a internet.');
  }

  // fetch NO falla con 4xx/5xx: hay que revisar res.ok
  if (!res.ok) {
    if (res.status === 401 || res.status === 403) {
      throw new GiphyError('La API key no es válida o no tiene permiso.', res.status);
    }
    if (res.status === 429) {
      throw new GiphyError('Llegaste al límite de peticiones de tu API key. Espera un rato.', res.status);
    }
    throw new GiphyError(`GIPHY respondió con un error (${res.status}).`, res.status);
  }

  const body = await res.json();
  const gifs: Gif[] = (body.data ?? []).filter((g: Gif) => g?.images?.fixed_width?.url);
  return { gifs, total: body.pagination?.total_count ?? gifs.length };
}
