import { Component } from '@angular/core';

// Reutilizamos la lógica del árbol n-ario del reto anterior (Challenge 07)
interface MenuItem {
  title: string;
  link: string;
  children?: MenuItem[];
}

@Component({
  selector: 'app-page-two',
  standalone: true,
  imports: [],
  templateUrl: './page-two.component.html',
  styleUrl: './page-two.component.css'
})
export class PageTwoComponent {
  menu: MenuItem[] = [
    {
      title: 'Profile',
      link: '/profile'
    },
    {
      title: 'Messages',
      link: '/messages'
    },
    {
      title: 'Settings',
      link: '/settings',
      children: [
        { title: 'Account', link: '/settings/account' },
        { title: 'Profile', link: '/settings/profile' },
        { title: 'Security & Privacy', link: '/settings/security' },
        { title: 'Password', link: '/settings/password' },
        { title: 'Notification', link: '/settings/notification' }
      ]
    },
    {
      title: 'Help',
      link: '/help',
      children: [
        { title: "FAQ's", link: '/help/faqs' },
        { title: 'Submit a Ticket', link: '/help/ticket' },
        { title: 'Network Status', link: '/help/network-status' }
      ]
    }
  ];

  // Qué tan del árbol está seleccionado (identificado por su "link" único)
  selectedLink: string | null = this.menu[0].link;

  // Qué submenús (padres con hijos) están expandidos
  expanded = new Set<string>(['/settings']);

  selectItem(item: MenuItem): void {
    if (item.children) {
      this.toggleExpand(item);
      return;
    }
    this.selectedLink = item.link;
  }

  toggleExpand(item: MenuItem): void {
    if (this.expanded.has(item.link)) {
      this.expanded.delete(item.link);
    } else {
      this.expanded.add(item.link);
    }
  }

  isExpanded(item: MenuItem): boolean {
    return this.expanded.has(item.link);
  }

  isSelected(item: MenuItem): boolean {
    return this.selectedLink === item.link;
  }
}
