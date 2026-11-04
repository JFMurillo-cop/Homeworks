import { Component, OnDestroy, OnInit, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RealtimeChannel } from '@supabase/supabase-js';
import { TareasService } from '../../services/tareas.service';
import { SupabaseService } from '../../services/supabase.service';

@Component({
  selector: 'app-tareas',
  imports: [FormsModule],
  templateUrl: './tareas.html',
  styleUrl: './tareas.css'
})
export class TareasComponent implements OnInit, OnDestroy {
  protected srv = inject(TareasService);
  private sb = inject(SupabaseService).client;
  private canal?: RealtimeChannel;

  tareas = signal<any[]>([]);
  nueva = '';
  msg = signal('');

  async ngOnInit() {
    await this.cargar();
    this.canal = this.srv.escuchar(() => this.cargar());
  }

  async cargar() {
    const { data, error } = await this.srv.listar();
    if (error) this.msg.set(error.message);
    this.tareas.set(data ?? []);
  }

  async agregar() {
    const titulo = this.nueva.trim();
    if (!titulo) return;
    const { error } = await this.srv.crear(titulo);
    if (error) this.msg.set(error.message);
    else this.nueva = '';
    await this.cargar();
  }

  async completar(t: any) {
    this.msg.set('');
    const { error } = await this.srv.completar(t.id, !t.completada);
    if (error) this.msg.set(error.message);
    await this.cargar();
  }

  async borrar(id: number) {
    this.msg.set('');
    const { error } = await this.srv.borrar(id);
    if (error) this.msg.set(error.message);
    await this.cargar();
  }

  ngOnDestroy() {
    if (this.canal) this.sb.removeChannel(this.canal);
  }
}
