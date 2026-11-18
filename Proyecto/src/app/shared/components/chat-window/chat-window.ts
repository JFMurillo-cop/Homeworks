import {
  Component,
  DestroyRef,
  ElementRef,
  effect,
  inject,
  input,
  signal,
  viewChild,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { Unsubscribe } from 'firebase/firestore';
import { ChatMessage } from '../../../core/models';
import { AuthService } from '../../../core/services/auth.service';
import { ChatService } from '../../../core/services/chat.service';
import { ToastService } from '../../../core/services/toast.service';

/**
 * Ventana de chat reutilizable (hija). La usan el cliente (/soporte) y el admin (/admin/chat/:uid).
 * Se suscribe en tiempo real al hilo `threadId`.
 */
@Component({
  selector: 'app-chat-window',
  imports: [FormsModule, DatePipe],
  template: `
    <div class="chat card">
      <header>
        <strong>{{ title() }}</strong>
        <span class="live">● en vivo</span>
      </header>
      <div class="messages" #scroller>
        @for (m of messages(); track m.id) {
          <div class="msg" [class.mine]="m.senderId === auth.user()?.uid">
            <small>{{ m.senderName }} · {{ m.createdAt | date: 'short' }}</small>
            <p>{{ m.text }}</p>
          </div>
        } @empty {
          <p class="muted empty-msg">Aún no hay mensajes. ¡Escribe el primero!</p>
        }
      </div>
      <form (ngSubmit)="send()">
        <input name="text" [(ngModel)]="text" placeholder="Escribe un mensaje…" autocomplete="off" maxlength="500" />
        <button class="btn" [disabled]="!text.trim() || sending()">Enviar</button>
      </form>
    </div>
  `,
  styles: `
    .chat { display: flex; flex-direction: column; height: 520px; padding: 0; overflow: hidden; }
    header { display: flex; justify-content: space-between; padding: 1rem 1.25rem; border-bottom: 1px solid var(--border); }
    .live { color: var(--ok); font-size: 0.85rem; }
    .messages { flex: 1; overflow-y: auto; padding: 1rem; display: flex; flex-direction: column; gap: 0.6rem; background: var(--bg); }
    .msg { max-width: 75%; align-self: flex-start; background: var(--surface); border: 1px solid var(--border); border-radius: 12px 12px 12px 4px; padding: 0.5rem 0.8rem; }
    .msg.mine { align-self: flex-end; background: var(--primary); color: #fff; border-color: var(--primary); border-radius: 12px 12px 4px 12px; }
    .msg small { opacity: 0.75; font-size: 0.72rem; }
    .msg p { margin: 0.15rem 0 0; white-space: pre-wrap; word-break: break-word; }
    .empty-msg { text-align: center; margin: auto; }
    form { display: flex; gap: 0.5rem; padding: 0.75rem; border-top: 1px solid var(--border); }
    input { flex: 1; font: inherit; padding: 0.6rem 0.8rem; border: 1px solid var(--border); border-radius: 10px; }
  `,
})
export class ChatWindow {
  protected readonly auth = inject(AuthService);
  private readonly chat = inject(ChatService);
  private readonly toast = inject(ToastService);

  readonly threadId = input.required<string>();
  /** Nombre del dueño del hilo (el cliente), para la bandeja del admin. */
  readonly threadOwnerName = input.required<string>();
  readonly title = input('Chat de soporte');

  protected readonly messages = signal<ChatMessage[]>([]);
  protected readonly sending = signal(false);
  protected text = '';
  private readonly scroller = viewChild<ElementRef<HTMLElement>>('scroller');

  constructor() {
    let unsubscribe: Unsubscribe | null = null;
    effect((onCleanup) => {
      unsubscribe = this.chat.listenMessages(this.threadId(), (msgs) => {
        this.messages.set(msgs);
        setTimeout(() => {
          const el = this.scroller()?.nativeElement;
          if (el) el.scrollTop = el.scrollHeight;
        });
      });
      onCleanup(() => unsubscribe?.());
    });
    inject(DestroyRef).onDestroy(() => unsubscribe?.());
  }

  async send(): Promise<void> {
    const user = this.auth.user();
    const text = this.text.trim();
    if (!user || !text) return;
    this.sending.set(true);
    try {
      await this.chat.send(this.threadId(), this.threadOwnerName(), user, text);
      this.text = '';
    } catch (e) {
      this.toast.error('No se pudo enviar el mensaje.');
      console.error(e);
    } finally {
      this.sending.set(false);
    }
  }
}
