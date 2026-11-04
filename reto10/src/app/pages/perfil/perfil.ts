import { Component, OnInit, inject, signal } from '@angular/core';
import { SupabaseService } from '../../services/supabase.service';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.html',
  styleUrl: './perfil.css'
})
export class PerfilComponent implements OnInit {
  private sb = inject(SupabaseService).client;
  url = signal('');

  async ngOnInit() {
    // Recupera el avatar guardado en los metadatos del usuario (si existe)
    const { data: { user } } = await this.sb.auth.getUser();
    const ruta = user?.user_metadata?.['avatar_path'];
    if (ruta) this.url.set(this.urlPublica(ruta));
  }

  private urlPublica(ruta: string) {
    return this.sb.storage.from('avatars').getPublicUrl(ruta).data.publicUrl;
  }

  async subir(e: Event) {
    const file = (e.target as HTMLInputElement).files?.[0];
    if (!file) return;

    const { data: { user } } = await this.sb.auth.getUser();
    if (!user) return;

    // La primera carpeta debe ser el id del usuario (lo exige la política de Storage)
    const ruta = `${user.id}/${Date.now()}-${file.name}`;

    const { error } = await this.sb.storage.from('avatars').upload(ruta, file, { upsert: false });
    if (error) return alert(error.message);

    this.url.set(this.urlPublica(ruta));
    const { error: errorMeta } = await this.sb.auth.updateUser({ data: { avatar_path: ruta } });
    if (errorMeta) alert(errorMeta.message);
  }
}
