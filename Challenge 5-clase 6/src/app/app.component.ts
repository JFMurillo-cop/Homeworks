import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Queue } from './classes/queue';
import { Person } from './models/person.model';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'Challenge 05 - Cola de personas en el ATM';

  peopleQueue = new Queue<Person>();

  personForm: FormGroup;

  // Matches formatted amounts like "150.000" or "2.069,05"
  private readonly amountPattern = /^\d{1,3}(\.\d{3})*(,\d{1,2})?$/;

  constructor(private fb: FormBuilder) {
    this.personForm = this.fb.group({
      name: ['', Validators.required],
      withdrawalAmount: ['', [Validators.required, Validators.pattern(this.amountPattern)]]
    });

    this.loadMockData();
  }

  /** Fills the queue with some initial mock data, each with a random arrival date. */
  private loadMockData(): void {
    const mockPeople = [
      { name: 'Laura Gómez', withdrawalAmount: 150000 },
      { name: 'Andrés Ramírez', withdrawalAmount: 80000 },
      { name: 'Mariana Torres', withdrawalAmount: 320000 }
    ];

    mockPeople.forEach(person => {
      this.peopleQueue.enqueue({
        name: person.name,
        withdrawalAmount: person.withdrawalAmount,
        arrivalDate: this.generateRandomArrivalDate()
      });
    });
  }

  /**
   * Generates a random arrival date, simulating the system's assignment
   * (as required by the challenge: "a random arrival date assigned by the system").
   * The date falls somewhere within the last hour from now.
   */
  private generateRandomArrivalDate(): Date {
    const now = Date.now();
    const upToOneHourAgo = Math.floor(Math.random() * 60 * 60 * 1000);
    return new Date(now - upToOneHourAgo);
  }

  /**
   * Live-formats the amount input as the user types: adds "." as the thousands
   * separator and allows "," for decimals, e.g. "2.069,05".
   */
  formatAmountInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    let value = input.value.replace(/[^0-9,]/g, '');

    const commaIndex = value.indexOf(',');
    let integerPart = commaIndex >= 0 ? value.slice(0, commaIndex) : value;
    let decimalPart = commaIndex >= 0 ? value.slice(commaIndex + 1).replace(/,/g, '').slice(0, 2) : '';

    integerPart = integerPart.replace(/^0+(?=\d)/, '');
    integerPart = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, '.');

    const formatted = commaIndex >= 0 ? `${integerPart},${decimalPart}` : integerPart;

    input.value = formatted;
    this.personForm.get('withdrawalAmount')?.setValue(formatted, { emitEvent: false });
  }

  /** Converts a formatted amount ("2.069,05") into a plain number (2069.05). */
  private parseAmount(formatted: string): number {
    const normalized = formatted.replace(/\./g, '').replace(',', '.');
    return parseFloat(normalized) || 0;
  }

  /** Formats a plain number as "2.069,05" for display in the queue list. */
  formatAmount(amount: number): string {
    return amount.toLocaleString('es-CO', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  }

  /** Reads the form, enqueues a new person with a random system-assigned arrival date, and resets the form. */
  addPerson(): void {
    if (this.personForm.invalid) {
      this.personForm.markAllAsTouched();
      return;
    }

    const { name, withdrawalAmount } = this.personForm.value;

    const newPerson: Person = {
      name,
      withdrawalAmount: this.parseAmount(withdrawalAmount),
      arrivalDate: this.generateRandomArrivalDate()
    };

    this.peopleQueue.enqueue(newPerson);
    this.personForm.reset();
  }

  /** Attends and removes the first person in the queue. */
  attendNext(): void {
    this.peopleQueue.dequeue();
  }

  /** People in the queue, ordered by arrival date (earliest first). */
  get queuedPeople(): Person[] {
    return this.peopleQueue.print().slice().sort(
      (a, b) => a.arrivalDate.getTime() - b.arrivalDate.getTime()
    );
  }

  get isQueueEmpty(): boolean {
    return this.peopleQueue.isEmpty();
  }

  get queueSize(): number {
    return this.peopleQueue.size();
  }
}
