import { Component, OnInit } from '@angular/core';
import { addDays } from 'date-fns';
import { Specialty } from 'src/app/auth/interfaces/specialty';
import { Shift } from 'src/app/interfaces/shift.interface';
import { Admin, Patient, Specialist } from 'src/app/interfaces/entities';
import { ShiftService } from '../../services/shift.service';
import { ShiftStatus } from 'src/app/constants/shifts';
import { formatConfirmShift } from 'src/app/helpers/shift';
import { successNotification } from 'src/app/helpers/notifications';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { AuthService } from 'src/app/auth/services/auth.service';
import { Roles } from 'src/app/constants/roles';

@Component({
  selector: 'app-request-shift',
  templateUrl: './request-shift.component.html',
  styleUrls: ['./request-shift.component.css'],
})
export class RequestShiftComponent implements OnInit {
  public currentUserFromDB: Patient | Specialist | Admin | null = null;
  public requestShiftForm: FormGroup;
  public selectedSpecialty: Specialty | null = null;
  public selectedSpecialist: Patient | Specialist | Admin | null = null;
  public selectedPatient: any = null;
  public shifts: Shift[] | null = null;
  public updatedShifts: Shift[] | null = null;
  public selectedShift: Shift | null = null;

  constructor(
    private authService: AuthService,
    private shiftService: ShiftService,
    private fb: FormBuilder
  ) {
    this.requestShiftForm = this.fb.group({
      specialty: new FormControl(null, [Validators.required]),
      specialist: new FormControl(null, [Validators.required]),
      patient: new FormControl(null, [Validators.required]),
      shift: new FormControl(null, [Validators.required]),
    });
  }

  async ngOnInit(): Promise<void> {
    this.shiftService.autoUpdateShifts();

    const { currentUserFromDB } = await this.authService.getCurrentUser();
    this.currentUserFromDB = currentUserFromDB;

    if (this.currentUserFromDB) {
      if (this.currentUserFromDB.role === Roles.PATIENT) {
        this.setSelectedPatient(this.currentUserFromDB);
        this.requestShiftForm.patchValue({
          patient: this.selectedPatient.firstName,
        });
      }
    }
  }

  setSelectedSpecialty(specialty: Specialty | null) {
    this.selectedSpecialty = specialty;
    this.setSelectedSpecialist(null);
    this.requestShiftForm.patchValue({
      specialty: this.selectedSpecialty?.name,
    });
  }

  async setSelectedSpecialist(specialist: Patient | Specialist | Admin | null) {
    this.selectedSpecialist = specialist;

    if (this.selectedSpecialist) {
      this.requestShiftForm.patchValue({
        specialist: this.selectedSpecialist.firstName,
      });

      const result = await this.shiftService.getShiftsByEmail({
        email: this.selectedSpecialist.email,
        role: Roles.SPECIALIST,
      });

      result.subscribe((shifts: Shift[]) => {
        const today = new Date();
        // De hoy a 15 días al futuro.
        const dateIn15Days = addDays(today, 15).getTime();

        const availableCondition = (shift: Shift) =>
          shift.status === ShiftStatus.AVAILABLE &&
          new Date(shift.day).getTime() < dateIn15Days;

        const updatedShifts = shifts
          .filter((shift: Shift) => {
            return (
              availableCondition(shift) &&
              shift.specialty === this.selectedSpecialty?.name
            );
          })
          .sort((a: Shift, b: Shift) => {
            const dateA = new Date(a.day).getTime();
            const dateB = new Date(b.day).getTime();

            return dateA - dateB;
          });

        this.shifts = updatedShifts;
      });
    } else {
      this.requestShiftForm.patchValue({ specialist: null });
      this.selectedShift = null;
      this.requestShiftForm.patchValue({ shift: null });
    }
  }

  setSelectedPatient(patient: Patient | Specialist | Admin | null) {
    this.selectedPatient = patient;
    this.requestShiftForm.patchValue({
      patient: this.selectedPatient.firstName,
    });
  }

  setSelectedShift(shift: Shift | null) {
    this.selectedShift = shift;
    this.requestShiftForm.patchValue({ shift: this.selectedShift?.day });
  }

  formatConfirmShift(shift: Shift) {
    return formatConfirmShift(shift);
  }

  onConfirmShift() {
    const updatedShift: Shift = {
      ...this.selectedShift!,
      status: ShiftStatus.PENDING,
      patient: this.selectedPatient,
    };

    this.shiftService.updateShiftData(updatedShift);

    successNotification({
      title: 'Estado del turno',
      text: 'El turno fue solicitado con éxito!',
    });

    this.setSelectedSpecialty(null);
    this.setSelectedSpecialist(null);
    this.setSelectedPatient(null);
    this.setSelectedShift(null);
  }
}
