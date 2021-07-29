import { Component, OnInit } from '@angular/core';
import { Specialty } from 'src/app/auth/interfaces/specialty';
import { ShiftStatus } from 'src/app/constants/shifts';
import { Patient, Specialist, Admin } from 'src/app/interfaces/entities';
import { Shift } from 'src/app/interfaces/shift.interface';
import { ShiftService } from 'src/app/protected/services/shift.service';

@Component({
  selector: 'app-shifts-admin',
  templateUrl: './shifts-admin.component.html',
  styleUrls: ['./shifts-admin.component.css'],
})
export class ShiftsAdminComponent implements OnInit {
  public selectedSpecialty: Specialty | null = null;
  public selectedSpecialist: Patient | Specialist | Admin | null = null;
  public selectedShift: Shift | null = null;

  constructor(private shiftService: ShiftService) {}

  ngOnInit(): void {
    this.shiftService.autoUpdateShifts();
  }

  setSelectedSpecialty(specialty: Specialty | null) {
    this.selectedSpecialty = specialty;
  }

  setSelectedSpecialist(specialist: Patient | Specialist | Admin | null) {
    this.selectedSpecialist = specialist;
  }

  setSelectedShift(shift: Shift | null) {
    this.selectedShift = shift;
  }
}
