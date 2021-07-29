import { Component, OnInit } from '@angular/core';
import { Specialty } from 'src/app/auth/interfaces/specialty';
import { AuthService } from 'src/app/auth/services/auth.service';
import { Roles } from 'src/app/constants/roles';
import { ShiftStatus } from 'src/app/constants/shifts';
import { Patient, Specialist, Admin } from 'src/app/interfaces/entities';
import { Shift } from 'src/app/interfaces/shift.interface';
import { ShiftService } from 'src/app/protected/services/shift.service';

@Component({
  selector: 'app-my-shifts',
  templateUrl: './my-shifts.component.html',
  styleUrls: ['./my-shifts.component.css'],
})
export class MyShiftsComponent implements OnInit {
  public currentUserFromDB: Patient | Specialist | Admin | null = null;
  public selectedSpecialty: Specialty | null = null;
  public selectedSpecialist: Patient | Specialist | Admin | null = null;
  public selectedPatient: Patient | Specialist | Admin | null = null;
  public selectedShift: Shift | null = null;

  public isPatient: boolean = false;
  public isSpecialist: boolean = false;

  constructor(
    private authService: AuthService,
    private shiftService: ShiftService
  ) {}

  async ngOnInit(): Promise<void> {
    const { currentUserFromDB } = await this.authService.getCurrentUser();
    this.currentUserFromDB = currentUserFromDB;
    console.log(`this.currentUserFromDB`, this.currentUserFromDB);

    this.isPatient = this.currentUserFromDB?.role === Roles.PATIENT;
    this.isSpecialist = this.currentUserFromDB?.role === Roles.SPECIALIST;

    this.shiftService.autoUpdateShifts();
  }

  setSelectedSpecialty(specialty: Specialty | null) {
    this.selectedSpecialty = specialty;
  }

  setSelectedSpecialist(specialist: Patient | Specialist | Admin | null) {
    this.selectedSpecialist = specialist;
  }

  setSelectedPatient(patient: Patient | Specialist | Admin | null) {
    this.selectedPatient = patient;
  }

  setSelectedShift(shift: Shift | null) {
    this.selectedShift = shift;
  }
}
