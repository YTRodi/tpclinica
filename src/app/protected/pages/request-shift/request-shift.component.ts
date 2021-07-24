import { Component, OnInit } from '@angular/core';
import { SpecialtyI } from 'src/app/auth/interfaces/specialty';
import { Shift } from 'src/app/interfaces/shift.interface';
import { Admin, Patient, Specialist } from 'src/app/interfaces/entities';
import { ShiftService } from '../../services/shift.service';
import { formatShift } from 'src/app/helpers/shift';
import { ShiftStatus } from 'src/app/constants/shifts';
import { addDays, isPast, parseISO } from 'date-fns';

@Component({
  selector: 'app-request-shift',
  templateUrl: './request-shift.component.html',
  styleUrls: ['./request-shift.component.css'],
})
export class RequestShiftComponent implements OnInit {
  public selectedSpecialty: SpecialtyI | null = null;
  public selectedSpecialist: Patient | Specialist | Admin | null = null;
  public selectedPatient: Patient | Specialist | Admin | null = null;
  public shifts: Shift[] | null = null;
  public updatedShifts: Shift[] | null = null;
  public selectedShift: Shift | null = null;

  constructor(private shiftService: ShiftService) {}

  ngOnInit(): void {
    this.shiftService.autoUpdateShifts();
  }

  setSelectedSpecialty(specialty: SpecialtyI) {
    this.selectedSpecialty = specialty;
  }

  async setSelectedSpecialist(specialist: Patient | Specialist | Admin | null) {
    this.selectedSpecialist = specialist;

    if (this.selectedSpecialist) {
      const result = await this.shiftService.getShiftsByEmail(
        this.selectedSpecialist.email
      );

      result.subscribe((shifts: Shift[]) => {
        const today = new Date();
        // De hoy a 15 días al futuro.
        const dateIn15Days = addDays(today, 15).getTime();

        const updatedShifts = shifts
          .filter(
            (shift: Shift) =>
              shift.status === ShiftStatus.AVAILABLE &&
              new Date(shift.day).getTime() < dateIn15Days
          )
          .sort((a: Shift, b: Shift) => {
            const dateA = new Date(a.day).getTime();
            const dateB = new Date(b.day).getTime();

            return dateA - dateB;
          });

        this.shifts = updatedShifts;
      });
    }
  }

  setSelectedPatient(patient: Patient | Specialist | Admin | null) {
    this.selectedPatient = patient;
  }

  setSelectedShift(shift: Shift | null) {
    this.selectedShift = shift;
  }

  /**
   * Use cases:
   * Debo mostrar el especialista si no tiene turnos para esa especialidad?
   */

  /**
   * Mostrar los shifts con separador por fechas. (array reduce tipo gravy calendar view)
   */

  /**
   * Como filtrar los turnos disponibles en los siguientes 15 días? fácil...
   * hago un const fechaEnQuinceDias = addDays(new Date(), 15);
   * luego filtrar los shifts.day que me traigo de la DB, tienen que ser menor o igual a la variable fechaEnQuinceDias
   *
   * Y AGREGARLE que el weekDay empieza los días lunes, NO LOS DOMINGOS.
   */

  /**
   * Cartel de error cuando no hay dias y horarios disponibles para esa especialidad y especialista.
   */

  // #-1 (OK)
  // TODO: ordenar las especialidades por orden alfabético

  // #0 - OK
  // TODO: cada que se renderee este componente, que se actualicen los shifts (si pasaron, que se cambien de estado a status UNAVAILABLE), se puede?...

  // #1 - OK
  // TODO: cambiar el height de los componentes tabla (si hay más de 3 elementos en el array que si tome el height que tiene ahora, sino, que tome el height de los elementos que están.)
  // TODO: cambiar el height de los componentes tabla (si hay más de 3 elementos en el array que si tome el height que tiene ahora, sino, que tome el height de los elementos que están.)
  // TODO: cambiar el height de los componentes tabla (si hay más de 3 elementos en el array que si tome el height que tiene ahora, sino, que tome el height de los elementos que están.)
  // TODO: cambiar el height de los componentes tabla (si hay más de 3 elementos en el array que si tome el height que tiene ahora, sino, que tome el height de los elementos que están.)
  // TODO: cambiar el height de los componentes tabla (si hay más de 3 elementos en el array que si tome el height que tiene ahora, sino, que tome el height de los elementos que están.)

  // #2 - OK
  // TODO: dia y horario: falta traerme los que tienen el status available
  // TODO: dia y horario: falta traerme los que tienen el status available
  // TODO: dia y horario: falta traerme los que tienen el status available

  // #3
  // TODO: Cuando actualice el documento del shift que voy a crear (agregarle el paciente), tengo que cambiar el status
  // TODO: Cuando actualice el documento del shift que voy a crear (agregarle el paciente), tengo que cambiar el status
  // TODO: Cuando actualice el documento del shift que voy a crear (agregarle el paciente), tengo que cambiar el status
  // TODO: Cuando actualice el documento del shift que voy a crear (agregarle el paciente), tengo que cambiar el status
}
