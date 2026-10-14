// Tipo de dato tal como se guarda en la base de datos (Firestore).
// Es una representación PLANA (lista) con punteros parentId,
// que es la forma estándar de persistir un árbol en una base documental.
export type NodeType = 'folder' | 'file';

export interface NodeRecord {
  id: string;
  name: string;
  type: NodeType;
  parentId: string | null; // null = nodo raíz
  ownerId: string; // uid del dueño del árbol (para que cada usuario vea solo el suyo)
  createdBy: string; // correo de quien creó la carpeta/archivo (dato validador)
  createdAt: number;
}
