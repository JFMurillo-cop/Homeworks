// ===============================================
// Ranking de canciones populares: MAX HEAP
// ===============================================
// Árbol binario completo guardado en un arreglo.
// Para el índice i:  padre = (i-1)/2,  hijos = 2i+1 y 2i+2
// Propiedad: cada padre tiene MÁS reproducciones que sus hijos,
// así la canción más escuchada siempre está en heap[0].

export class MaxHeap {
  constructor() {
    this.heap = []; // elementos: { title, plays }
  }

  get size() {
    return this.heap.length;
  }

  isEmpty() {
    return this.heap.length === 0;
  }

  // Ver la canción más escuchada sin sacarla -> O(1)
  peek() {
    return this.heap[0] ?? null;
  }

  // Insertar -> O(log n)
  insert(title, plays) {
    this.heap.push({ title, plays });
    this.#siftUp(this.heap.length - 1);
  }

  // Extraer la canción con más reproducciones -> O(log n)
  extractMax() {
    if (this.isEmpty()) return null;
    const max = this.heap[0];
    const last = this.heap.pop();
    if (!this.isEmpty()) {
      this.heap[0] = last;
      this.#siftDown(0);
    }
    return max;
  }

  // TOP k canciones sin destruir el heap original -> O(k log n)
  topK(k) {
    const copy = new MaxHeap();
    copy.heap = [...this.heap];
    const top = [];
    while (top.length < k && !copy.isEmpty()) top.push(copy.extractMax());
    return top;
  }

  // Sumar reproducciones a una canción existente (o crearla)
  addPlays(title, amount = 1) {
    const i = this.heap.findIndex((s) => s.title === title);
    if (i === -1) return this.insert(title, amount);
    this.heap[i].plays += amount;
    this.#siftUp(i); // al aumentar solo puede subir
  }

  #swap(i, j) {
    [this.heap[i], this.heap[j]] = [this.heap[j], this.heap[i]];
  }

  #siftUp(i) {
    while (i > 0) {
      const parent = Math.floor((i - 1) / 2);
      if (this.heap[parent].plays >= this.heap[i].plays) break;
      this.#swap(parent, i);
      i = parent;
    }
  }

  #siftDown(i) {
    const n = this.heap.length;
    while (true) {
      const left = 2 * i + 1;
      const right = 2 * i + 2;
      let largest = i;
      if (left < n && this.heap[left].plays > this.heap[largest].plays) largest = left;
      if (right < n && this.heap[right].plays > this.heap[largest].plays) largest = right;
      if (largest === i) break;
      this.#swap(i, largest);
      i = largest;
    }
  }
}
