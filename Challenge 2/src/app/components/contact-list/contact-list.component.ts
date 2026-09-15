import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Contact } from '../../models/contact.model';

@Component({
  selector: 'app-contact-list',
  standalone: true,
  imports: [],
  templateUrl: './contact-list.component.html',
  styleUrl: './contact-list.component.css'
})
export class ContactListComponent {
  @Input() contacts: Contact[] = [];
  @Output() delete = new EventEmitter<number>();

  onDelete(id: number): void {
    this.delete.emit(id);
  }
}
