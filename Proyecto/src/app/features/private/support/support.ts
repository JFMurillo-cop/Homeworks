import { Component, inject } from '@angular/core';
import { AuthService } from '../../../core/services/auth.service';
import { ChatWindow } from '../../../shared/components/chat-window/chat-window';

/** El cliente conversa en su propio hilo: chats/{uid}. */
@Component({
  selector: 'app-support',
  imports: [ChatWindow],
  template: `
    <div class="container page narrow">
      <h1>💬 Soporte</h1>
      <p class="muted">¿Dudas con un pedido? Escríbenos y te respondemos en tiempo real.</p>
      @if (auth.user(); as user) {
        <app-chat-window [threadId]="user.uid" [threadOwnerName]="user.name" title="Equipo CampusMarket" />
      }
    </div>
  `,
  styles: `.narrow { max-width: 760px; }`,
})
export class Support {
  protected readonly auth = inject(AuthService);
}
