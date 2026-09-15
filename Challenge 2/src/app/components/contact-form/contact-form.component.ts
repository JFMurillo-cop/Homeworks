import { Component, EventEmitter, Output } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';

@Component({
  selector: 'app-contact-form',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './contact-form.component.html',
  styleUrl: './contact-form.component.css'
})
export class ContactFormComponent {
  name = '';
  phone = '';

  @Output() add = new EventEmitter<{ name: string; phone: string }>();

  onSubmit(form: NgForm): void {
    if (form.invalid) {
      return;
    }
    this.add.emit({ name: this.name.trim(), phone: this.phone.trim() });
    this.name = '';
    this.phone = '';
    form.resetForm();
  }
}
