import { Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ChatWindow } from '../../../shared/components/chat-window/chat-window';

/** El admin responde en el hilo del cliente: /admin/chat/:uid?nombre=... */
@Component({
  selector: 'app-admin-chat',
  imports: [ChatWindow, RouterLink],
  template: `
    <div class="container page narrow">
      <a routerLink="/admin">← Volver al panel</a>
      <h1>Chat con {{ nombre() || 'cliente' }}</h1>
      <app-chat-window [threadId]="uid()" [threadOwnerName]="nombre() || 'Cliente'" [title]="'Cliente: ' + (nombre() || uid())" />
    </div>
  `,
  styles: `.narrow { max-width: 760px; }`,
})
export class AdminChat {
  readonly uid = input.required<string>();
  readonly nombre = input<string>();
}
