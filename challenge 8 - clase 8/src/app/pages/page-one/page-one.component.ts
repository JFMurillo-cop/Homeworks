import { AfterViewInit, Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { drawTree } from './tree-visualizer';

// Reutilizamos la lógica del árbol binario del reto anterior (Challenge 06)
class Nodo {
  valor: number;
  izquierda: Nodo | null = null;
  derecha: Nodo | null = null;
  constructor(valor: number) {
    this.valor = valor;
  }
}

class ArbolBinario {
  raiz: Nodo | null = null;

  insertar(valor: number): void {
    const nuevoNodo = new Nodo(valor);
    if (!this.raiz) {
      this.raiz = nuevoNodo;
      return;
    }
    let actual = this.raiz;
    while (true) {
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

  contiene(valor: number): boolean {
    let actual = this.raiz;
    while (actual) {
      if (valor === actual.valor) return true;
      actual = valor < actual.valor ? actual.izquierda : actual.derecha;
    }
    return false;
  }

  preorden(nodo: Nodo | null = this.raiz, r: number[] = []): number[] {
    if (!nodo) return r;
    r.push(nodo.valor);
    this.preorden(nodo.izquierda, r);
    this.preorden(nodo.derecha, r);
    return r;
  }

  inorden(nodo: Nodo | null = this.raiz, r: number[] = []): number[] {
    if (!nodo) return r;
    this.inorden(nodo.izquierda, r);
    r.push(nodo.valor);
    this.inorden(nodo.derecha, r);
    return r;
  }

  postorden(nodo: Nodo | null = this.raiz, r: number[] = []): number[] {
    if (!nodo) return r;
    this.postorden(nodo.izquierda, r);
    this.postorden(nodo.derecha, r);
    r.push(nodo.valor);
    return r;
  }
}

@Component({
  selector: 'app-page-one',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './page-one.component.html',
  styleUrl: './page-one.component.css'
})
export class PageOneComponent implements AfterViewInit {
  valores = [25, 15, 50, 10, 22, 35, 70, 4, 12, 18, 24, 31, 44, 66, 90];
  arbol = new ArbolBinario();

  preorder: number[];
  inorder: number[];
  postorder: number[];

  searchValue: number | null = null;
  searchResult: { found: boolean; value: number } | null = null;

  constructor() {
    this.valores.forEach(v => this.arbol.insertar(v));
    this.preorder = this.arbol.preorden();
    this.inorder = this.arbol.inorden();
    this.postorder = this.arbol.postorden();
  }

  ngAfterViewInit(): void {
    drawTree('#tree-container', this.arbol.raiz);
  }

  buscar(): void {
    if (this.searchValue === null) return;
    const found = this.arbol.contiene(this.searchValue);
    this.searchResult = { found, value: this.searchValue };
  }
}
