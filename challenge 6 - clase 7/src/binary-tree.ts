// Nodo del árbol binario
export class Nodo {
  valor: number;
  izquierda: Nodo | null = null;
  derecha: Nodo | null = null;

  constructor(valor: number) {
    this.valor = valor;
  }

  isLeaf(): boolean {
    return this.izquierda === null && this.derecha === null;
  }
}

export class ArbolBinario {
  raiz: Nodo | null = null;

  // Punto 1: inserta un valor en el árbol (árbol de búsqueda binaria)
  insertar(valor: number): void {
    const nuevoNodo = new Nodo(valor);

    if (!this.raiz) {
      this.raiz = nuevoNodo;
      return;
    }

    let actual = this.raiz;
    while (true) {
      if (valor === actual.valor) {
        // Este ejemplo no permite valores repetidos
        return;
      }
      if (valor < actual.valor) {
        if (!actual.izquierda) {
          actual.izquierda = nuevoNodo;
          return;
        }
        actual = actual.izquierda;
      } else {
        if (!actual.derecha) {
          actual.derecha = nuevoNodo;
          return;
        }
        actual = actual.derecha;
      }
    }
  }

  // Inserta varios valores de una vez
  insertarVarios(valores: number[]): void {
    valores.forEach(valor => this.insertar(valor));
  }

  // Punto 2: verifica si un valor existe en el árbol
  contiene(valor: number): boolean {
    let actual = this.raiz;
    while (actual) {
      if (valor === actual.valor) {
        return true;
      }
      actual = valor < actual.valor ? actual.izquierda : actual.derecha;
    }
    return false;
  }

  // Punto 1: recorridos, devuelven un arreglo con el orden de valores
  preorden(nodo: Nodo | null = this.raiz, resultado: number[] = []): number[] {
    if (!nodo) return resultado;
    resultado.push(nodo.valor);
    this.preorden(nodo.izquierda, resultado);
    this.preorden(nodo.derecha, resultado);
    return resultado;
  }

  inorden(nodo: Nodo | null = this.raiz, resultado: number[] = []): number[] {
    if (!nodo) return resultado;
    this.inorden(nodo.izquierda, resultado);
    resultado.push(nodo.valor);
    this.inorden(nodo.derecha, resultado);
    return resultado;
  }

  postorden(nodo: Nodo | null = this.raiz, resultado: number[] = []): number[] {
    if (!nodo) return resultado;
    this.postorden(nodo.izquierda, resultado);
    this.postorden(nodo.derecha, resultado);
    resultado.push(nodo.valor);
    return resultado;
  }
}
