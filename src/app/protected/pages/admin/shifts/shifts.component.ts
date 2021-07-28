import { Component, OnInit } from '@angular/core';
import { SpecialtyI } from 'src/app/auth/interfaces/specialty';
import { Patient, Specialist, Admin } from 'src/app/interfaces/entities';
import { ShiftService } from 'src/app/protected/services/shift.service';

@Component({
  selector: 'app-shifts',
  templateUrl: './shifts.component.html',
  styleUrls: ['./shifts.component.css'],
})
export class ShiftsComponent implements OnInit {
  public currentUserFromDB: Patient | Specialist | Admin | null = null;
  public selectedSpecialty: SpecialtyI | null = null;
  public selectedSpecialist: Patient | Specialist | Admin | null = null;

  constructor(private shiftService: ShiftService) {}

  ngOnInit(): void {
    this.shiftService.autoUpdateShifts();
  }

  setSelectedSpecialty(specialty: SpecialtyI | null) {
    this.selectedSpecialty = specialty;
    console.log(`this.selectedSpecialty`, this.selectedSpecialty);
    // this.setSelectedSpecialist(null);
    // this.requestShiftForm.patchValue({
    //   specialty: this.selectedSpecialty?.name,
    // });
  }
}
