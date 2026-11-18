import { Component, inject } from '@angular/core';
import { ToastService } from '../../../core/services/toast.service';

@Component({
  selector: 'app-toasts',
  template: `
    <div class="toasts" aria-live="polite">
      @for (t of toast.toasts(); track t.id) {
        <div class="toast" [class.error]="t.kind === 'error'">{{ t.text }}</div>
      }
    </div>
  `,
  styles: `
    .toasts { position: fixed; bottom: 1.25rem; right: 1.25rem; z-index: 50; display: flex; flex-direction: column; gap: 0.5rem; }
    .toast { background: var(--text); color: #fff; padding: 0.75rem 1rem; border-radius: 10px; box-shadow: var(--shadow-hover); max-width: 340px; animation: in 0.2s ease-out; }
    .toast.error { background: var(--primary-dark); }
    @keyframes in { from { opacity: 0; transform: translateY(8px); } }
  `,
})
export class Toasts {
  protected readonly toast = inject(ToastService);
}
