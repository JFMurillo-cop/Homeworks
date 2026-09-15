import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterOutlet } from '@angular/router';
import { SinglyLinkedList, DoublyLinkedList, CircularLinkedList, CircularDoublyLinkedList } from './dataStructure';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterOutlet],
  styleUrl: './app.css',
  template: `
    <div style="max-width: 1000px; margin: 0 auto; padding: 20px; font-family: 'Segoe UI', sans-serif; color: #333;">
      <h1 style="text-align: center; color: #2c3e50; margin-bottom: 30px; border-bottom: 2px solid #dd0031; padding-bottom: 10px;">
        🏥 Sistema de Gestión Clínica (Angular)
      </h1>

      <div style="background: #e0f7fa; border: 1px solid #eaeaea; border-left: 6px solid #00acc1; border-radius: 10px; padding: 20px; box-shadow: 0 4px 6px rgba(0,0,0,0.05); margin-bottom: 20px;">
        <h3 style="margin: 0 0 10px 0; color: #007c91;">👨‍⚕️ Médico de Guardia Actual</h3>
        <p style="font-size: 1.4rem; margin: 0; font-weight: bold; color: #006064;">{{ currentDoctor }}</p>
      </div>

      <div style="display: flex; gap: 20px; flex-wrap: wrap;">
        <div style="background: #fff; border: 1px solid #eaeaea; border-radius: 10px; padding: 20px; box-shadow: 0 4px 6px rgba(0,0,0,0.05); flex: 1; min-width: 300px;">
          <h3 style="margin-top: 0; color: #2c3e50;">⏳ Pacientes en Espera</h3>
          
          <form (submit)="handleAddPatient($event)" style="display: flex; flex-direction: column; gap: 10px; margin-bottom: 15px;">
            <input 
              type="text" 
              placeholder="Nombre del paciente..." 
              name="newPatientName"
              [(ngModel)]="newPatientName" 
              style="padding: 10px; border-radius: 6px; border: 1px solid #ccc; outline: none;"
            />
            <input 
              type="text" 
              placeholder="Síntoma o motivo de consulta..." 
              name="newPatientSymptom"
              [(ngModel)]="newPatientSymptom" 
              style="padding: 10px; border-radius: 6px; border: 1px solid #ccc; outline: none;"
            />
            <button type="submit" style="padding: 10px 15px; background: #dd0031; color: white; border: none; border-radius: 6px; cursor: pointer; font-weight: bold;">
              Agregar Paciente
            </button>
          </form>

          <ul style="list-style-type: none; padding: 0; margin: 0;">
            <p *ngIf="queueList.length === 0" style="color: #999; font-style: italic;">No hay pacientes en espera.</p>
            <li *ngFor="let p of queueList" style="background: #f8f9fa; border: 1px solid #e9ecef; margin: 8px 0; padding: 12px; border-radius: 6px; display: flex; justify-content: space-between; align-items: center;">
              <span><strong>{{ p.name }}</strong></span>
              <span style="font-size: 0.9em; color: #e67e22; background: #fdf2e9; padding: 4px 8px; border-radius: 12px;">{{ p.symptom }}</span>
            </li>
          </ul>

          <button 
            (click)="handleAttendPatient()" 
            style="width: 100%; background: #27ae60; color: white; padding: 12px; border: none; border-radius: 6px; cursor: pointer; margin-top: 15px; font-weight: bold; font-size: 1rem;"
          >
            ✅ Atender Siguiente Paciente
          </button>
        </div>

        <div style="background: #fff; border: 1px solid #eaeaea; border-radius: 10px; padding: 20px; box-shadow: 0 4px 6px rgba(0,0,0,0.05); flex: 1; min-width: 300px;">
          <h3 style="margin-top: 0; color: #2c3e50;">📂 Historial de Atención</h3>
          <ul style="list-style-type: none; padding: 0; margin: 0;">
            <p *ngIf="historyList.length === 0" style="color: #999; font-style: italic;">Aún no se han atendido pacientes.</p>
            <li *ngFor="let h of historyList" style="background: #f8f9fa; border: 1px solid #e9ecef; margin: 8px 0; padding: 12px; border-radius: 6px; display: flex; flex-direction: column; align-items: flex-start; gap: 5px;">
              <strong>{{ h.name }} <span style="font-size: 0.85rem; color: #e67e22; font-weight: normal;">({{ h.symptom }})</span></strong>
              <span style="font-size: 0.85rem; color: #555;">
                Atendido por <b>{{ h.attendedBy }}</b> a las {{ h.time }}
              </span>
            </li>
          </ul>
        </div>
      </div>

      <div style="background: #fff; border: 1px solid #eaeaea; border-radius: 10px; padding: 20px; box-shadow: 0 4px 6px rgba(0,0,0,0.05); margin-top: 20px;">
        <h3 style="margin-top: 0; color: #2c3e50;">🏢 Comité Administrativo</h3>
        <div style="display: flex; gap: 10px; flex-wrap: wrap;">
          <div *ngFor="let member of committeeList" style="background: #f1c40f; color: #333; padding: 10px 20px; border-radius: 20px; font-weight: bold; border: 1px solid #d4ac0d;">
            {{ member }}
          </div>
        </div>
      </div>
    </div>
  `
})
export class App implements OnInit, OnDestroy {
  patientQueue = new SinglyLinkedList();
  careHistory = new DoublyLinkedList();
  doctorRotation = new CircularLinkedList();
  committee = new CircularDoublyLinkedList();

  queueList: any[] = [];
  historyList: any[] = [];
  committeeList: any[] = [];
  currentDoctor: string = '';
  newPatientName: string = '';
  newPatientSymptom: string = '';

  private intervalId: any;
  private currentDocNode: any;

  constructor(private cdr: ChangeDetectorRef) {
    this.patientQueue.append({ id: 1, name: "Ana Gómez", symptom: "Fiebre" });
    this.patientQueue.append({ id: 2, name: "Carlos Pérez", symptom: "Dolor abdominal" });
    
    this.doctorRotation.append("Dr. House");
    this.doctorRotation.append("Dra. Grey");
    this.doctorRotation.append("Dr. Strange");
    
    this.committee.append("Director Juan");
    this.committee.append("Subdirectora Marta");
    this.committee.append("Administrador Luis");

    this.updateLists();
    this.currentDocNode = this.doctorRotation.head;
    this.currentDoctor = this.currentDocNode?.value || '';
  }

  ngOnInit() {
    this.intervalId = setInterval(() => {
      if (this.currentDocNode) {
        this.currentDocNode = this.currentDocNode.next;
        this.currentDoctor = this.currentDocNode.value;
        this.cdr.detectChanges();
      }
    }, 10000);
  }

  ngOnDestroy() {
    if (this.intervalId) clearInterval(this.intervalId);
  }

  updateLists() {
    this.queueList = this.patientQueue.toArray();
    this.historyList = this.careHistory.toArray();
    this.committeeList = this.committee.toArray();
  }

  handleAddPatient(event: Event) {
    event.preventDefault();
    if (!this.newPatientName.trim()) return;
    
    const symptomText = this.newPatientSymptom.trim() ? this.newPatientSymptom.trim() : "Consulta general";

    this.patientQueue.append({ 
      id: Date.now(), 
      name: this.newPatientName.trim(), 
      symptom: symptomText 
    });

    this.updateLists();
    this.newPatientName = '';
    this.newPatientSymptom = '';
  }

  handleAttendPatient() {
    const attended = this.patientQueue.removeFirst();
    if (attended) {
      this.careHistory.append({ 
        ...attended, 
        attendedBy: this.currentDoctor, 
        time: new Date().toLocaleTimeString() 
      });
      this.updateLists();
    } else {
      alert("No hay pacientes en espera.");
    }
  }
}