import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';
import { Contact } from '../models/contact.model';

@Injectable({
  providedIn: 'root'
})
export class ContactService {
  // Lista inicial de contactos "precargados", como si vinieran de un backend
  private contacts: Contact[] = [
    { id: 1, name: 'Ana Torres', phone: '3001234567' },
    { id: 2, name: 'Carlos Ruiz', phone: '3109876543' },
    { id: 3, name: 'Laura Gómez', phone: '3157654321' }
  ];

  private nextId = 4;

  constructor() {}

  /**
   * Simula la carga inicial de datos desde un servidor,
   * devolviendo la lista de contactos después de un retraso.
   */
  getContacts(): Observable<Contact[]> {
    return of(this.contacts).pipe(delay(1500));
  }

  addContact(name: string, phone: string): Contact {
    const newContact: Contact = { id: this.nextId++, name, phone };
    this.contacts.push(newContact);
    return newContact;
  }

  deleteContact(id: number): void {
    this.contacts = this.contacts.filter(c => c.id !== id);
  }
}
