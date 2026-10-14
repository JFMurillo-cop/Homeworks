import { Injectable, signal, computed } from '@angular/core';
import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  onSnapshot,
  serverTimestamp,
  Unsubscribe,
  getDocs,
  query,
  where,
} from 'firebase/firestore';
import { db } from '../core/firebase';
import { AuthService } from './auth.service';
import { NodeRecord, NodeType } from '../models/node.model';
import { NAryTree } from '../models/n-ary-tree';

const COLLECTION = 'nodes';

/**
 * Servicio que encapsula TODA la persistencia del árbol en Firestore.
 * Guarda una lista PLANA de nodos (cada uno con su parentId), y a partir
 * de esa lista construye en memoria el árbol n-ario (NAryTree) definido
 * desde cero en models/n-ary-tree.ts. Esto permite consultar el árbol a
 * futuro (está en base de datos) sin atarse a cómo Firestore guarda los datos.
 */
@Injectable({ providedIn: 'root' })
export class FileSystemService {
  private recordsSignal = signal<NodeRecord[]>([]);
  private loadingSignal = signal<boolean>(true);
  private errorSignal = signal<string | null>(null);
  private unsubscribe: Unsubscribe | null = null;

  readonly isLoading = this.loadingSignal.asReadonly();
  readonly error = this.errorSignal.asReadonly();

  // El árbol se recalcula automáticamente cada vez que cambian los registros
  readonly tree = computed(() => new NAryTree(this.recordsSignal()));

  constructor(private authService: AuthService) {}

  /**
   * Escucha en tiempo real TODO el árbol (compartido entre todos los
   * usuarios registrados). El correo (createdBy) es el dato validador
   * que identifica quién creó cada carpeta/archivo.
   */
  listen(): void {
    this.stopListening();
    this.loadingSignal.set(true);

    this.unsubscribe = onSnapshot(
      collection(db, COLLECTION),
      (snapshot) => {
        const records: NodeRecord[] = snapshot.docs.map((d) => {
          const data = d.data() as any;
          return {
            id: d.id,
            name: data.name,
            type: data.type,
            parentId: data.parentId,
            ownerId: data.ownerId,
            createdBy: data.createdBy,
            createdAt: data.createdAt?.toMillis?.() ?? Date.now(),
          };
        });
        this.recordsSignal.set(records);
        this.loadingSignal.set(false);
      },
      (err) => {
        this.errorSignal.set('No se pudo cargar el árbol de archivos.');
        this.loadingSignal.set(false);
        console.error(err);
      },
    );
  }

  stopListening(): void {
    if (this.unsubscribe) {
      this.unsubscribe();
      this.unsubscribe = null;
    }
  }

  /**
   * Crea una carpeta o archivo nuevo.
   * Reglas validadas ANTES de tocar la base de datos:
   *  - El usuario debe estar logueado (requisito del parcial).
   *  - El padre (si existe) debe ser una carpeta; un archivo no puede tener hijos.
   */
  async createNode(name: string, type: NodeType, parentId: string | null): Promise<string> {
    const user = this.authService.currentUser();
    if (!user || !user.email) {
      throw new Error('Debes iniciar sesión para crear una carpeta o archivo.');
    }

    if (!this.tree().canAddChildTo(parentId)) {
      throw new Error('No se puede crear contenido dentro de un archivo.');
    }

    const docRef = await addDoc(collection(db, COLLECTION), {
      name,
      type,
      parentId,
      ownerId: user.uid,
      createdBy: user.email,
      createdAt: serverTimestamp(),
    });
    return docRef.id;
  }

  /** Cambia el nombre de una carpeta o archivo existente. */
  async renameNode(id: string, newName: string): Promise<void> {
    const trimmed = newName.trim();
    if (!trimmed) {
      throw new Error('El nombre no puede quedar vacío.');
    }
    await updateDoc(doc(db, COLLECTION, id), { name: trimmed });
  }

  /**
   * Elimina un nodo y, en cascada, todos sus descendientes
   * (si era una carpeta con contenido).
   */
  async deleteNode(id: string): Promise<void> {
    const node = this.tree().findById(id);
    if (!node) return;

    const idsToDelete = node.preorder().map((n) => n.id);
    await Promise.all(idsToDelete.map((nodeId) => deleteDoc(doc(db, COLLECTION, nodeId))));
  }

  /** Útil para validar en el registro si el correo ya tiene nodos creados (consulta de ejemplo). */
  async countNodesByEmail(email: string): Promise<number> {
    const q = query(collection(db, COLLECTION), where('createdBy', '==', email));
    const snapshot = await getDocs(q);
    return snapshot.size;
  }
}
