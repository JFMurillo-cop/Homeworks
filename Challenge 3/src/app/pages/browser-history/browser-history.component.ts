import { Component, OnInit } from '@angular/core';
import { DoublyLinkedList } from '../../models/doubly-linked-list';

interface PageVisit {
  url: string;
  title: string;
}

@Component({
  selector: 'app-browser-history',
  standalone: true,
  imports: [],
  templateUrl: './browser-history.component.html',
  styleUrl: './browser-history.component.css'
})
export class BrowserHistoryComponent implements OnInit {
  private history = new DoublyLinkedList<PageVisit>();

  currentPage: PageVisit | null = null;
  items: { value: PageVisit; isCurrent: boolean }[] = [];
  canGoBack = false;
  canGoForward = false;

  ngOnInit(): void {
    // Datos simulados (fake data) de páginas ya visitadas
    const mockedPages: PageVisit[] = [
      { url: 'inicio.com', title: 'Página de inicio' },
      { url: 'noticias.com', title: 'Noticias del día' },
      { url: 'correo.com', title: 'Bandeja de entrada' },
      { url: 'tienda.com', title: 'Catálogo de productos' }
    ];

    mockedPages.forEach(page => this.history.append(page));
    // El usuario "está" en la última página visitada
    while (this.history.hasForward()) {
      this.history.forward();
    }
    this.refresh();
  }

  goBack(): void {
    if (this.history.back()) {
      this.refresh();
    }
  }

  goForward(): void {
    if (this.history.forward()) {
      this.refresh();
    }
  }

  visitNewPage(): void {
    const n = this.items.length + 1;
    this.history.visit({ url: `pagina-nueva-${n}.com`, title: `Página nueva ${n}` });
    this.refresh();
  }

  private refresh(): void {
    this.currentPage = this.history.getCurrent();
    this.items = this.history.toArray();
    this.canGoBack = this.history.hasBack();
    this.canGoForward = this.history.hasForward();
  }
}
