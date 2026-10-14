import { Component, EventEmitter, Input, Output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NAryNode } from '../../models/n-ary-tree';

/**
 * Componente RECURSIVO: un nodo del árbol se renderiza a sí mismo
 * para pintar cada uno de sus hijos, sin importar cuántos niveles
 * de profundidad tenga el árbol n-ario.
 */
@Component({
  selector: 'app-tree-node',
  standalone: true,
  imports: [CommonModule, TreeNodeComponent],
  templateUrl: './tree-node.component.html',
  styleUrl: './tree-node.component.scss',
})
export class TreeNodeComponent {
  @Input({ required: true }) node!: NAryNode;
  @Input() depth = 0;
  @Input() canModify = false;

  @Output() addChild = new EventEmitter<NAryNode>();
  @Output() remove = new EventEmitter<NAryNode>();
  @Output() rename = new EventEmitter<NAryNode>();

  expanded = signal(true);

  toggleExpand(): void {
    this.expanded.update((v) => !v);
  }

  onAddChild(event: Event): void {
    event.stopPropagation();
    this.addChild.emit(this.node);
  }

  onRemove(event: Event): void {
    event.stopPropagation();
    this.remove.emit(this.node);
  }

  onRename(event: Event): void {
    event.stopPropagation();
    this.rename.emit(this.node);
  }

  onChildAddChild(node: NAryNode): void {
    this.addChild.emit(node);
  }

  onChildRemove(node: NAryNode): void {
    this.remove.emit(node);
  }

  onChildRename(node: NAryNode): void {
    this.rename.emit(node);
  }
}
