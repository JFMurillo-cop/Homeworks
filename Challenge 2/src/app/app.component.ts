import { Component, OnInit } from '@angular/core';
import { LoaderComponent } from './components/loader/loader.component';
import { ContactFormComponent } from './components/contact-form/contact-form.component';
import { ContactListComponent } from './components/contact-list/contact-list.component';
import { ContactService } from './services/contact.service';
import { Contact } from './models/contact.model';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [LoaderComponent, ContactFormComponent, ContactListComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {
  title = 'Gestor de Contactos';
  contacts: Contact[] = [];
  isLoading = true;

  constructor(private contactService: ContactService) {}

  ngOnInit(): void {
    this.contactService.getContacts().subscribe(data => {
      this.contacts = data;
      this.isLoading = false;
    });
  }

  onAddContact(newContact: { name: string; phone: string }): void {
    const created = this.contactService.addContact(newContact.name, newContact.phone);
    this.contacts = [...this.contacts, created];
  }

  onDeleteContact(id: number): void {
    this.contactService.deleteContact(id);
    this.contacts = this.contacts.filter(c => c.id !== id);
  }
}
