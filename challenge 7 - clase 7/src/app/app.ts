import { Component } from '@angular/core';
import { SidebarComponent } from './sidebar/sidebar';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [SidebarComponent],
  template: `
    <app-sidebar></app-sidebar>
  `,
  styles: [`
    :host {
      display: block;
      min-height: 100vh;
      background-color: #f5f5f5;
    }
  `]
})
export class App {
  title = 'challenge-07';
}