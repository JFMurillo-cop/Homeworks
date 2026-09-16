import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Stack } from './classes/stack';
import { Book } from './models/book.model';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'Challenge 04 - Stack de Libros';

  booksStack = new Stack<Book>();

  bookForm: FormGroup;

  duplicateWarning: string | null = null;

  constructor(private fb: FormBuilder) {
    this.bookForm = this.fb.group({
      name: ['', Validators.required],
      isbn: ['', Validators.required],
      author: ['', Validators.required],
      editorial: ['', Validators.required]
    });

    this.loadMockData();
  }

  /** Fills the stack with some initial mock data. */
  private loadMockData(): void {
    const mockBooks: Book[] = [
      { name: 'Cien años de soledad', isbn: '978-0307474728', author: 'Gabriel García Márquez', editorial: 'Sudamericana' },
      { name: 'Clean Code', isbn: '978-0132350884', author: 'Robert C. Martin', editorial: 'Prentice Hall' },
      { name: 'El principito', isbn: '978-0156012195', author: 'Antoine de Saint-Exupéry', editorial: 'Reynal & Hitchcock' }
    ];

    mockBooks.forEach(book => this.booksStack.push(book));
  }

  /** Reads the form, pushes a new book onto the stack, and resets the form. */
  addBook(): void {
    this.duplicateWarning = null;

    if (this.bookForm.invalid) {
      this.bookForm.markAllAsTouched();
      return;
    }

    const newBook: Book = this.bookForm.value;

    if (this.isbnExists(newBook.isbn)) {
      this.duplicateWarning = `Ya existe un libro con el ISBN "${newBook.isbn}" en la pila.`;
      return;
    }

    this.booksStack.push(newBook);
    this.bookForm.reset();
  }

  /** Checks whether a book with the given ISBN is already in the stack. */
  private isbnExists(isbn: string): boolean {
    return this.booksStack.print().some(book => book.isbn.trim() === isbn.trim());
  }

  /** Removes the last book added (top of the stack). */
  removeLastBook(): void {
    this.booksStack.pop();
  }

  /** Books ordered from top (most recently added) to bottom of the stack. */
  get stackedBooks(): Book[] {
    return this.booksStack.print();
  }

  get isStackEmpty(): boolean {
    return this.booksStack.isEmpty();
  }

  get stackSize(): number {
    return this.booksStack.size();
  }
}
