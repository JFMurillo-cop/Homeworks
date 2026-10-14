import { Component, OnInit, OnDestroy, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { TasksService } from '../../services/tasks.service';
import { AuthService } from '../../services/auth.service';
import { Task } from '../../models/task.model';

@Component({
  selector: 'app-tasks',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './tasks.component.html',
  styleUrl: './tasks.component.scss',
})
export class TasksComponent implements OnInit, OnDestroy {
  newTitle = '';
  newDescription = '';

  editingId = signal<string | null>(null);
  editTitle = '';
  editDescription = '';

  filter = signal<'all' | 'pending' | 'done'>('all');

  constructor(
    public tasksService: TasksService,
    public authService: AuthService,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.tasksService.listenToTasks();
  }

  ngOnDestroy(): void {
    this.tasksService.stopListening();
  }

  get filteredTasks(): Task[] {
    const tasks = this.tasksService.tasks();
    const f = this.filter();
    if (f === 'pending') return tasks.filter((t) => !t.done);
    if (f === 'done') return tasks.filter((t) => t.done);
    return tasks;
  }

  async addTask(): Promise<void> {
    if (!this.newTitle.trim()) return;
    await this.tasksService.addTask(this.newTitle.trim(), this.newDescription.trim());
    this.newTitle = '';
    this.newDescription = '';
  }

  startEdit(task: Task): void {
    this.editingId.set(task.id);
    this.editTitle = task.title;
    this.editDescription = task.description;
  }

  cancelEdit(): void {
    this.editingId.set(null);
  }

  async saveEdit(task: Task): Promise<void> {
    if (!this.editTitle.trim()) return;
    await this.tasksService.updateTask(task.id, {
      title: this.editTitle.trim(),
      description: this.editDescription.trim(),
    });
    this.editingId.set(null);
  }

  async toggleDone(task: Task): Promise<void> {
    await this.tasksService.toggleDone(task);
  }

  async deleteTask(task: Task): Promise<void> {
    await this.tasksService.deleteTask(task.id);
  }

  async logout(): Promise<void> {
    this.tasksService.stopListening();
    await this.authService.logout();
    this.router.navigate(['/login']);
  }
}
