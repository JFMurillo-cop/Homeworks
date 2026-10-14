import { NodeRecord, NodeType } from './node.model';

/**
 * Nodo de un árbol N-ARIO implementado desde cero.
 * Una carpeta ("folder") puede tener cualquier cantidad de hijos.
 * Un archivo ("file") NUNCA puede tener hijos: es siempre una hoja.
 */
export class NAryNode {
  id: string;
  name: string;
  type: NodeType;
  createdBy: string;
  createdAt: number;
  children: NAryNode[] = [];
  parent: NAryNode | null = null;

  constructor(record: NodeRecord) {
    this.id = record.id;
    this.name = record.name;
    this.type = record.type;
    this.createdBy = record.createdBy;
    this.createdAt = record.createdAt;
  }

  /**
   * Agrega un hijo a este nodo.
   * Regla de negocio central del parcial: un archivo no puede tener hijos.
   */
  addChild(child: NAryNode): void {
    if (this.type === 'file') {
      throw new Error(
        `No se puede agregar "${child.name}" dentro de "${this.name}": un archivo no puede tener hijos.`,
      );
    }
    child.parent = this;
    this.children.push(child);
  }

  /** Recorrido en profundidad (preorden): el nodo, luego sus hijos. */
  preorder(): NAryNode[] {
    const result: NAryNode[] = [this];
    for (const child of this.children) {
      result.push(...child.preorder());
    }
    return result;
  }

  /** Busca un nodo por id en todo el subárbol (incluyéndose a sí mismo). */
  findById(id: string): NAryNode | null {
    if (this.id === id) return this;
    for (const child of this.children) {
      const found = child.findById(id);
      if (found) return found;
    }
    return null;
  }

  /** Cuenta cuántos nodos descendientes tiene (sin contarse a sí mismo). */
  countDescendants(): number {
    return this.children.reduce((acc, child) => acc + 1 + child.countDescendants(), 0);
  }
}

/**
 * Administrador del árbol N-ario: construye el árbol (o bosque, si hay
 * varias raíces) a partir de la lista PLANA que viene de Firestore
 * (cada registro trae su parentId), y expone utilidades de consulta.
 */
export class NAryTree {
  roots: NAryNode[] = [];
  private nodesById = new Map<string, NAryNode>();

  constructor(records: NodeRecord[]) {
    this.build(records);
  }

  private build(records: NodeRecord[]): void {
    this.nodesById.clear();
    this.roots = [];

    // 1) Crear todos los nodos primero (sin relaciones todavía)
    for (const record of records) {
      this.nodesById.set(record.id, new NAryNode(record));
    }

    // 2) Enlazar padres e hijos usando parentId
    for (const record of records) {
      const node = this.nodesById.get(record.id)!;
      if (record.parentId === null) {
        this.roots.push(node);
      } else {
        const parent = this.nodesById.get(record.parentId);
        if (parent) {
          // Enlace directo (sin pasar por addChild) porque los datos
          // ya fueron validados al momento de crearlos en el servicio.
          node.parent = parent;
          parent.children.push(node);
        } else {
          // Padre no encontrado (dato huérfano): lo tratamos como raíz
          this.roots.push(node);
        }
      }
    }

    // Orden alfabético, carpetas primero (como un explorador de archivos real)
    this.sortTree(this.roots);
  }

  private sortTree(nodes: NAryNode[]): void {
    nodes.sort((a, b) => {
      if (a.type !== b.type) return a.type === 'folder' ? -1 : 1;
      return a.name.localeCompare(b.name);
    });
    for (const node of nodes) {
      this.sortTree(node.children);
    }
  }

  findById(id: string): NAryNode | null {
    return this.nodesById.get(id) ?? null;
  }

  /** Verifica si se puede crear un hijo dentro del nodo dado. */
  canAddChildTo(parentId: string | null): boolean {
    if (parentId === null) return true; // crear en la raíz siempre se permite
    const parent = this.nodesById.get(parentId);
    return !!parent && parent.type === 'folder';
  }
}
