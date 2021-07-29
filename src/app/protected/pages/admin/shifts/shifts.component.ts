import { Component, OnInit } from '@angular/core';
import { Specialty } from 'src/app/auth/interfaces/specialty';
import { ShiftStatus } from 'src/app/constants/shifts';
import { Patient, Specialist, Admin } from 'src/app/interfaces/entities';
import { Shift } from 'src/app/interfaces/shift.interface';
import { ShiftService } from 'src/app/protected/services/shift.service';

@Component({
  selector: 'app-shifts',
  templateUrl: './shifts.component.html',
  styleUrls: ['./shifts.component.css'],
})
export class ShiftsComponent implements OnInit {
  public currentUserFromDB: Patient | Specialist | Admin | null = null;
  public selectedSpecialty: Specialty | null = null;
  public selectedSpecialist: Patient | Specialist | Admin | null = null;
  public selectedShift: Shift | null = null;

  constructor(private shiftService: ShiftService) {}

  ngOnInit(): void {
    this.shiftService.autoUpdateShifts();
  }

  bothFilters() {
    return { specialty: this.selectedSpecialty, user: this.selectedSpecialist };
  }

  setSelectedSpecialty(specialty: Specialty | null) {
    this.selectedSpecialty = specialty;
    // console.log(`this.selectedSpecialty`, this.selectedSpecialty);
    // this.setSelectedSpecialist(null);
    // this.requestShiftForm.patchValue({
    //   specialty: this.selectedSpecialty?.name,
    // });
  }

  setSelectedSpecialist(specialist: Patient | Specialist | Admin | null) {
    this.selectedSpecialist = specialist;
    // console.log(`this.selectedSpecialist`, this.selectedSpecialist);
  }

  setSelectedShift(shift: Shift | null) {
    this.selectedShift = shift;
    console.log(`this.selectedShift`, this.selectedShift);
  }
}
