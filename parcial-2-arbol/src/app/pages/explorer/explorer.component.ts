import { Component, OnDestroy, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { FileSystemService } from '../../services/file-system.service';
import { NAryNode } from '../../models/n-ary-tree';
import { NodeType } from '../../models/node.model';
import { TreeNodeComponent } from '../../components/tree-node/tree-node.component';

interface CreateTarget {
  parentId: string | null;
  parentName: string; // "la raíz" o el nombre de la carpeta
}

@Component({
  selector: 'app-explorer',
  standalone: true,
  imports: [CommonModule, FormsModule, TreeNodeComponent],
  templateUrl: './explorer.component.html',
  styleUrl: './explorer.component.scss',
})
export class ExplorerComponent implements OnInit, OnDestroy {
  createTarget = signal<CreateTarget | null>(null);
  newName = '';
  newType: NodeType = 'folder';
  createError = signal<string | null>(null);

  deleteTarget = signal<NAryNode | null>(null);

  renameTarget = signal<NAryNode | null>(null);
  renameValue = '';
  renameError = signal<string | null>(null);

  constructor(
    public authService: AuthService,
    public fileSystemService: FileSystemService,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.fileSystemService.listen();
  }

  ngOnDestroy(): void {
    this.fileSystemService.stopListening();
  }

  get roots(): NAryNode[] {
    return this.fileSystemService.tree().roots;
  }

  openCreateAtRoot(): void {
    this.createTarget.set({ parentId: null, parentName: 'la raíz' });
    this.newName = '';
    this.newType = 'folder';
    this.createError.set(null);
  }

  openCreateInside(node: NAryNode): void {
    this.createTarget.set({ parentId: node.id, parentName: node.name });
    this.newName = '';
    this.newType = 'folder';
    this.createError.set(null);
  }

  closeCreateModal(): void {
    this.createTarget.set(null);
  }

  async confirmCreate(): Promise<void> {
    const target = this.createTarget();
    if (!target || !this.newName.trim()) return;

    try {
      await this.fileSystemService.createNode(this.newName.trim(), this.newType, target.parentId);
      this.createTarget.set(null);
    } catch (err) {
      this.createError.set((err as Error).message);
    }
  }

  askDelete(node: NAryNode): void {
    this.deleteTarget.set(node);
  }

  cancelDelete(): void {
    this.deleteTarget.set(null);
  }

  async confirmDelete(): Promise<void> {
    const node = this.deleteTarget();
    if (!node) return;
    await this.fileSystemService.deleteNode(node.id);
    this.deleteTarget.set(null);
  }

  openRename(node: NAryNode): void {
    this.renameTarget.set(node);
    this.renameValue = node.name;
    this.renameError.set(null);
  }

  cancelRename(): void {
    this.renameTarget.set(null);
  }

  async confirmRename(): Promise<void> {
    const node = this.renameTarget();
    if (!node || !this.renameValue.trim()) return;

    try {
      await this.fileSystemService.renameNode(node.id, this.renameValue.trim());
      this.renameTarget.set(null);
    } catch (err) {
      this.renameError.set((err as Error).message);
    }
  }

  async logout(): Promise<void> {
    this.fileSystemService.stopListening();
    await this.authService.logout();
    this.router.navigate(['/login']);
  }
}
