import { Component, OnInit } from '@angular/core';
import { SpecialtyI } from 'src/app/auth/interfaces/specialty';
import { Shift } from 'src/app/interfaces/shift.interface';
import { Admin, Patient, Specialist } from 'src/app/interfaces/entities';
import { ShiftService } from '../../services/shift.service';
import { formatShift } from 'src/app/helpers/shift';

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
  public selectedShift: Shift | null = null;

  constructor(private shiftService: ShiftService) {}

  ngOnInit(): void {}

  setSelectedSpecialty(specialty: SpecialtyI) {
    this.selectedSpecialty = specialty;
  }

  async setSelectedSpecialist(specialist: Patient | Specialist | Admin) {
    this.selectedSpecialist = specialist;

    if (this.selectedSpecialist) {
      const result = await this.shiftService.getShiftsByEmail(
        this.selectedSpecialist.email
      );

      result.subscribe((shifts: Shift[]) => {
        const orderedShifts = shifts.sort((a: Shift, b: Shift) => {
          const dateA = new Date(a.day).getTime();
          const dateB = new Date(b.day).getTime();

          return dateA - dateB;
        });

        this.shifts = orderedShifts;
      });
    }
  }

  setSelectedPatient(patient: Patient | Specialist | Admin) {
    this.selectedPatient = patient;
  }

  setSelectedShift(shift: Shift) {
    this.selectedShift = shift;
  }

  formatShift(shift: Shift): string {
    return formatShift(shift);
  }

  // TODO: dia y horario: falta traerme los que tienen el status available
  // TODO: dia y horario: falta traerme los que tienen el status available
  // TODO: dia y horario: falta traerme los que tienen el status available
}
