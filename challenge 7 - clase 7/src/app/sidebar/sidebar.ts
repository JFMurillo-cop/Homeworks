import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

interface MenuItem {
  title: string;
  link: string;
  component: string;
  children: MenuItem[];
  expanded?: boolean;
}

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="sidebar">
      <ng-container *ngTemplateOutlet="menuTree; context: { $implicit: menuData }"></ng-container>

      <ng-template #menuTree let-nodes>
        <ul class="menu-list">
          <li *ngFor="let node of nodes" class="menu-item">
            
            <!-- Aquí agregamos [class.active] para pintar el seleccionado -->
            <div class="menu-header" 
                 (click)="selectNode(node, $event)" 
                 [class.has-children]="node.children.length > 0"
                 [class.active]="node === selectedNode">
              <a [href]="node.link">{{ node.title }}</a>
              <span *ngIf="node.children.length > 0" class="toggle-icon">
                {{ node.expanded ? '▴' : '▾' }}
              </span>
            </div>

            <div class="menu-children" *ngIf="node.expanded && node.children.length > 0">
              <ng-container *ngTemplateOutlet="menuTree; context: { $implicit: node.children }"></ng-container>
            </div>
            
          </li>
        </ul>
      </ng-template>
    </div>
  `,
  styles: [`
    .sidebar {
      width: 250px;
      min-height: 100vh;
      background-color: #1e1e24;
      color: #a0a0a5;
      font-family: Arial, sans-serif;
      padding: 15px 0;
    }
    .menu-list {
      list-style: none;
      padding: 0;
      margin: 0;
    }
    .menu-children {
      padding-left: 20px;
      background-color: #18181d;
    }
    .menu-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 12px 24px;
      cursor: pointer;
      transition: background-color 0.2s, color 0.2s;
    }
    .menu-header:hover {
      background-color: #2a2a32;
      color: #ffffff;
    }
    .menu-header a {
      color: inherit;
      text-decoration: none;
      font-size: 14px;
      flex-grow: 1;
    }
    
    /* ESTE ES EL NUEVO ESTILO PARA EL ELEMENTO SELECCIONADO */
    .menu-header.active {
      background-color: #2b4570; /* Color azul oscuro como en la imagen */
      color: #ffffff;
    }

    .toggle-icon {
      font-size: 12px;
      margin-left: 10px;
    }
  `]
})
export class SidebarComponent {
  
  // Variable para guardar la opción clickeada
  selectedNode: MenuItem | null = null;

  menuData: MenuItem[] = [
    { title: 'Profile', link: '/profile', component: 'ProfileComponent', children: [] },
    { title: 'Messages', link: '/messages', component: 'MessagesComponent', children: [] },
    {
      title: 'Settings', link: '#', component: 'SettingsComponent', expanded: true, children: [
        { title: 'Account', link: '/settings/account', component: 'AccountComponent', children: [] },
        { title: 'Profile', link: '/settings/profile', component: 'SettingsProfileComponent', children: [] },
        { title: 'Security & Privacy', link: '/settings/security', component: 'SecurityComponent', children: [] },
        { title: 'Password', link: '/settings/password', component: 'PasswordComponent', children: [] },
        { title: 'Notification', link: '/settings/notification', component: 'NotificationComponent', children: [] },
      ]
    },
    {
      title: 'Help', link: '#', component: 'HelpComponent', children: [
        { title: "FAQ's", link: '/help/faqs', component: 'FaqsComponent', children: [] },
        { title: 'Submit a Ticket', link: '/help/ticket', component: 'TicketComponent', children: [] },
        { title: 'Network Status', link: '/help/network', component: 'NetworkComponent', children: [] },
      ]
    },
    { title: 'Logout', link: '/logout', component: 'LogoutComponent', children: [] },
  ];

  // Nueva función que selecciona el nodo y lo despliega
  selectNode(node: MenuItem, event: Event) {
    event.preventDefault(); // Evita que la página intente navegar a otro lado
    
    // Guardamos este nodo como el "seleccionado"
    this.selectedNode = node;

    // Si tiene submenús, los abrimos o cerramos
    if (node.children && node.children.length > 0) {
      node.expanded = !node.expanded;
    }
  }
}