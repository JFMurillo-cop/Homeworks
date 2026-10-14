import { Injectable, signal } from '@angular/core';
import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  query,
  where,
  onSnapshot,
  serverTimestamp,
  Unsubscribe,
} from 'firebase/firestore';
import { db } from '../core/firebase';
import { AuthService } from './auth.service';
import { Task } from '../models/task.model';

// Servicio que encapsula toda la lógica de Firestore para las tareas.
// Cada usuario solo ve/edita sus propias tareas (filtradas por uid).
@Injectable({ providedIn: 'root' })
export class TasksService {
  private tasksSignal = signal<Task[]>([]);
  private loadingSignal = signal<boolean>(false);
  private errorSignal = signal<string | null>(null);
  private unsubscribe: Unsubscribe | null = null;

  readonly tasks = this.tasksSignal.asReadonly();
  readonly isLoading = this.loadingSignal.asReadonly();
  readonly error = this.errorSignal.asReadonly();

  constructor(private authService: AuthService) {}

  /** Empieza a escuchar en tiempo real las tareas del usuario logueado. */
  listenToTasks(): void {
    const user = this.authService.currentUser();
    if (!user) {
      this.tasksSignal.set([]);
      return;
    }

    this.stopListening();
    this.loadingSignal.set(true);

    // Solo filtramos por uid (sin orderBy en la consulta) para no depender
    // de un índice compuesto de Firestore; el orden se aplica en el cliente.
    const tasksQuery = query(collection(db, 'tasks'), where('uid', '==', user.uid));

    this.unsubscribe = onSnapshot(
      tasksQuery,
      (snapshot) => {
        const tasks: Task[] = snapshot.docs.map((d) => {
          const data = d.data() as any;
          return {
            id: d.id,
            title: data.title,
            description: data.description,
            done: data.done,
            createdAt: data.createdAt?.toMillis?.() ?? Date.now(),
          };
        });
        tasks.sort((a, b) => b.createdAt - a.createdAt);
        this.tasksSignal.set(tasks);
        this.loadingSignal.set(false);
      },
      (err) => {
        this.errorSignal.set('No se pudieron cargar las tareas.');
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

  async addTask(title: string, description: string): Promise<void> {
    const user = this.authService.currentUser();
    if (!user) return;

    await addDoc(collection(db, 'tasks'), {
      uid: user.uid,
      title,
      description,
      done: false,
      createdAt: serverTimestamp(),
    });
  }

  async updateTask(id: string, changes: Partial<Pick<Task, 'title' | 'description'>>): Promise<void> {
    await updateDoc(doc(db, 'tasks', id), changes);
  }

  async toggleDone(task: Task): Promise<void> {
    await updateDoc(doc(db, 'tasks', task.id), { done: !task.done });
  }

  async deleteTask(id: string): Promise<void> {
    await deleteDoc(doc(db, 'tasks', id));
  }
}
