import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { ShiftStatus } from 'src/app/constants/shifts';
import {
  errorNotification,
  successNotification,
} from 'src/app/helpers/notifications';
import { formatConfirmShift, formatShiftStatus } from 'src/app/helpers/shift';
import { ClinicHistory } from 'src/app/interfaces/clinicHistory.interface';
import { Shift } from 'src/app/interfaces/shift.interface';
import { ClinicHistoryService } from 'src/app/protected/services/clinic-history.service';
import { ShiftService } from 'src/app/protected/services/shift.service';

const isValidAdminAndSpecialistShiftStatus = (shift: Shift) =>
  shift.status !== ShiftStatus.REJECTED &&
  shift.status !== ShiftStatus.ACCEPTED &&
  shift.status !== ShiftStatus.CANCELLED &&
  shift.status !== ShiftStatus.COMPLETED;

const getCommentShiftForm = () => {
  return new FormBuilder().group({
    comment: new FormControl(null, [
      Validators.required,
      Validators.minLength(6),
    ]),
  });
};

const getCompletedShiftForm = () => {
  // return new FormBuilder().group({
  //   comment: new FormControl(null, [
  //     Validators.required,
  //     Validators.minLength(6),
  //   ]),
  //   diagnosis: new FormControl(null, [
  //     Validators.required,
  //     Validators.minLength(6),
  //   ]),
  //   height: new FormControl(null, [
  //     Validators.required,
  //     Validators.min(30),
  //     Validators.max(210),
  //   ]),
  //   weight: new FormControl(null, [
  //     Validators.required,
  //     Validators.min(20),
  //     Validators.max(180),
  //   ]),
  //   temperature: new FormControl(null, [
  //     Validators.required,
  //     Validators.min(36),
  //     Validators.max(42),
  //   ]),
  //   pressureSystolic: new FormControl(null, [
  //     Validators.required,
  //     Validators.min(120),
  //     Validators.max(129),
  //   ]),
  //   pressureDiastolic: new FormControl(null, [
  //     Validators.required,
  //     Validators.min(80),
  //     Validators.max(84),
  //   ]),

  //   //TODO, datos dinámicos: edad y IMC?
  // });

  return new FormBuilder().group({
    comment: new FormControl('comentario largo', [
      Validators.required,
      Validators.minLength(6),
    ]),
    diagnosis: new FormControl('comentario largo', [
      Validators.required,
      Validators.minLength(6),
    ]),
    height: new FormControl(180, [
      Validators.required,
      Validators.min(30),
      Validators.max(210),
    ]),
    weight: new FormControl(90, [
      Validators.required,
      Validators.min(20),
      Validators.max(180),
    ]),
    temperature: new FormControl(36, [
      Validators.required,
      Validators.min(36),
      Validators.max(42),
    ]),
    pressureSystolic: new FormControl(120, [
      Validators.required,
      Validators.min(120),
      Validators.max(129),
    ]),
    pressureDiastolic: new FormControl(80, [
      Validators.required,
      Validators.min(80),
      Validators.max(84),
    ]),

    // edad y
  });
};

@Component({
  selector: 'app-shifts-table',
  templateUrl: './shifts-table.component.html',
  styleUrls: ['./shifts-table.component.css'],
})
export class ShiftsTableComponent implements OnInit {
  @Output() onSelectShift: EventEmitter<Shift | null>;

  // Filter buttons
  @Input() isAdmin: boolean = false;
  @Input() isSpecialist: boolean = false;
  @Input() isPatient: boolean = false;

  @Input() showShiftDetail: boolean = true;
  @Input() showPatient: boolean = false;
  @Input() showSpecialist: boolean = false;

  @Input() title: string = 'turnos';
  public shiftList: Array<Shift> | null = null;
  public selectedShift: Shift | null = null;

  public isCancelShift: boolean = false;
  public isRejectShift: boolean = false;
  public isCompletedShift: boolean = false;

  // Forms
  public commentShiftForm: FormGroup = getCommentShiftForm();
  public completedShiftForm: FormGroup = getCompletedShiftForm();

  constructor(
    private shiftService: ShiftService,
    private clinicHistoryService: ClinicHistoryService
  ) {
    this.onSelectShift = new EventEmitter<Shift | null>();
  }

  ngOnInit(): void {
    this.shiftService.getAllShifts().subscribe((shifts: Shift[]) => {
      const updatedShifts = shifts
        .filter((shift: Shift) => shift.status !== ShiftStatus.UNAVAILABLE)
        .sort((a: Shift, b: Shift) => {
          const dateA = new Date(a.day).getTime();
          const dateB = new Date(b.day).getTime();

          return dateA - dateB;
        });

      this.shiftList = updatedShifts;
    });
  }

  async selectShift(selectedShift: Shift) {
    this.onSelectShift.emit(selectedShift);
    this.selectedShift = selectedShift;
  }

  getErrorMessageCancelShift(formControlName: string) {
    if (this.commentShiftForm.get(formControlName)?.touched) {
      if (this.commentShiftForm.get(formControlName)?.errors?.required)
        return 'Debes ingresar un valor';

      if (this.commentShiftForm.get(formControlName)?.hasError('minlength'))
        return 'El comentario debe contener 6 caracteres como mínimo;';
    }

    return '';
  }

  getErrorMessageCompletedShift(formControlName: string) {
    if (this.completedShiftForm.get(formControlName)?.touched) {
      if (this.completedShiftForm.get(formControlName)?.errors?.required)
        return 'Debes ingresar un valor';

      if (
        (formControlName === 'comment' || formControlName === 'diagnosis') &&
        this.completedShiftForm.get(formControlName)?.hasError('minlength')
      ) {
        return 'El comentario debe contener 6 caracteres como mínimo,';
      }

      // min - max
      if (formControlName === 'height') {
        if (this.completedShiftForm.get(formControlName)?.errors?.min)
          return 'La altura mínima es de 30cm';
        else if (this.completedShiftForm.get(formControlName)?.errors?.max)
          return 'La altura máxima es de 210cm';
      }

      if (formControlName === 'weight') {
        if (this.completedShiftForm.get(formControlName)?.errors?.min)
          return 'El peso mínimo es de 20kg';
        else if (this.completedShiftForm.get(formControlName)?.errors?.max)
          return 'El peso máximo es de 180kg';
      }

      if (formControlName === 'temperature') {
        if (this.completedShiftForm.get(formControlName)?.errors?.min)
          return 'La temperatura mínima es de 36ºC';
        else if (this.completedShiftForm.get(formControlName)?.errors?.max)
          return 'La temperatura máxima es de 42ºC';
      }

      if (formControlName === 'pressureSystolic') {
        if (this.completedShiftForm.get(formControlName)?.errors?.min)
          return 'La presión sistólica mínima es de 120 mmHg';
        else if (this.completedShiftForm.get(formControlName)?.errors?.max)
          return 'La presión sistólica máxima es de 129 mmHg';
      }

      if (formControlName === 'pressureDiastolic') {
        if (this.completedShiftForm.get(formControlName)?.errors?.min)
          return 'La presión diastólica mínima es de 80 mmHg';
        else if (this.completedShiftForm.get(formControlName)?.errors?.max)
          return 'La presión diastólica máxima es de 84 mmHg';
      }
    }

    return '';
  }

  formatStatus(shiftStatus: string) {
    return formatShiftStatus(shiftStatus);
  }

  formatShift(shift: Shift) {
    return formatConfirmShift(shift);
  }

  getAcceptShiftCondition(shift: Shift) {
    return this.isSpecialist && isValidAdminAndSpecialistShiftStatus(shift);
  }

  getCancelShiftCondition(shift: Shift) {
    const conditionAdminAndSpecialist = this.isAdmin || this.isSpecialist;

    if (conditionAdminAndSpecialist) {
      return isValidAdminAndSpecialistShiftStatus(shift);
    }

    // Patient
    return (
      shift.status !== ShiftStatus.CANCELLED &&
      shift.status !== ShiftStatus.COMPLETED
    );
  }

  getRejectShiftCondition(shift: Shift) {
    return this.isSpecialist && isValidAdminAndSpecialistShiftStatus(shift);
  }

  getCompletedShiftCondition(shift: Shift) {
    // TODO: BORRAR EL '!' this.isSpecialist es para pruebas!!
    // TODO: BORRAR EL '!' this.isSpecialist es para pruebas!!
    // TODO: BORRAR EL '!' this.isSpecialist es para pruebas!!
    // TODO: BORRAR EL '!' this.isSpecialist es para pruebas!!
    // TODO: BORRAR EL '!' this.isSpecialist es para pruebas!!
    // TODO: BORRAR EL '!' this.isSpecialist es para pruebas!!
    return !this.isSpecialist && shift.status === ShiftStatus.ACCEPTED;
  }

  async onAcceptShift(shift: Shift) {
    const acceptedShift: Shift = { ...shift, status: ShiftStatus.ACCEPTED };
    await this.shiftService.updateShiftData(acceptedShift);

    successNotification({
      title: 'Estado del turno',
      text: 'El turno fue aprobado con éxito!',
    });
  }

  async onCancelShift() {
    const { comment } = this.commentShiftForm.getRawValue();
    const cancelledShift: Shift = {
      ...this.selectedShift!,
      status: ShiftStatus.CANCELLED,
      cancelReason: comment,
    };

    await this.shiftService.updateShiftData(cancelledShift);

    successNotification({
      title: 'Estado del turno',
      text: 'El turno fue cancelado con éxito!',
    });
  }

  async onRejectShift() {
    const { comment } = this.commentShiftForm.getRawValue();
    const rejectedShift: Shift = {
      ...this.selectedShift!,
      status: ShiftStatus.REJECTED,
      rejectReason: comment,
    };

    await this.shiftService.updateShiftData(rejectedShift);

    successNotification({
      title: 'Estado del turno',
      text: 'El turno fue rechazado con éxito!',
    });
  }

  async onCompletedShift(): Promise<any> {
    const {
      comment,
      diagnosis,
      height,
      weight,
      temperature,
      pressureSystolic,
      pressureDiastolic,
    } = this.completedShiftForm.getRawValue();

    try {
      if (this.selectedShift && this.selectedShift.patient) {
        const completedShift: Shift = {
          ...this.selectedShift,
          status: ShiftStatus.COMPLETED,
          commentCompleted: comment,
          diagnosis,
          completedAt: new Date().toString(),
          patientData: {
            height,
            weight,
            temperature,
            pressure: {
              pressureSystolic,
              pressureDiastolic,
            },
          },
        };

        await this.shiftService.updateShiftData(completedShift);

        const clinicHistoryByPatientEmail =
          await this.clinicHistoryService.getClinicHistoriesByPatientEmail(
            this.selectedShift.patient.email
          );

        const newSubscription = clinicHistoryByPatientEmail.subscribe(
          (data: ClinicHistory[]) => {
            if (data.length === 0) {
              const firstClinicHistory: ClinicHistory = {
                patient: completedShift.patient,
                shifts: [completedShift],
              };

              // No uso await, por qué sino me genera un bucle infinito.
              this.clinicHistoryService.addClinicHistory(firstClinicHistory);

              successNotification({
                title: 'Estado del turno',
                text: 'El turno fue completado y agendado en la historia clínica con éxito!',
              });

              return newSubscription.unsubscribe();
            }

            const updatedClinicHistory: ClinicHistory = {
              ...data[0],
              shifts: [...data[0].shifts!, completedShift],
            };

            this.clinicHistoryService
              .updateClinicHistorytData(updatedClinicHistory)
              .then(() => {
                successNotification({
                  title: 'Estado del turno',
                  text: 'El turno fue completado y agendado en la historia clínica con éxito!',
                });
              });

            return newSubscription.unsubscribe();
          }
        );
      }
    } catch (error) {
      errorNotification({ text: error.message });
    }
  }
}

/**
 * TODO:
 * 1) Hacer que filtre los shifts por specialty o specialist o los dos juntos. (Si ninguno está seleccionado, mostrar todos los existentes)
 * 2) Agregar los datos dinámicos que me pide en el sprint 3
 */
