import { Component, OnInit } from '@angular/core';
import { SpecialtyI } from 'src/app/auth/interfaces/specialty';
import { Admin, Patient, Specialist } from 'src/app/interfaces/entities';

@Component({
  selector: 'app-request-shift',
  templateUrl: './request-shift.component.html',
  styleUrls: ['./request-shift.component.css'],
})
export class RequestShiftComponent implements OnInit {
  public selectedSpecialty: SpecialtyI | null = null;
  public selectedUser: Patient | Specialist | Admin | null = null;

  constructor() {}

  ngOnInit(): void {}

  setSelectedSpecialty(specialty: SpecialtyI) {
    this.selectedSpecialty = specialty;
  }

  setSelectedUser(user: Patient | Specialist | Admin) {
    this.selectedUser = user;
  }

  // TODO: Me falta la parte de día y horarios... (formatear el día y el horario delos turnos disponibles (status: AVAILABLE) por especialista seleccionado)
  // TODO: Me falta la parte de día y horarios... (formatear el día y el horario delos turnos disponibles (status: AVAILABLE) por especialista seleccionado)
  // TODO: Me falta la parte de día y horarios... (formatear el día y el horario delos turnos disponibles (status: AVAILABLE) por especialista seleccionado)
  // TODO: Me falta la parte de día y horarios... (formatear el día y el horario delos turnos disponibles (status: AVAILABLE) por especialista seleccionado)
  // TODO: Me falta la parte de día y horarios... (formatear el día y el horario delos turnos disponibles (status: AVAILABLE) por especialista seleccionado)
}
