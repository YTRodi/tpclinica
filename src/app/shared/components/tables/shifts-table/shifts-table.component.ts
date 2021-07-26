import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { ShiftStatus } from 'src/app/constants/shifts';
import {
  confirmNotification,
  successNotification,
} from 'src/app/helpers/notifications';
import { formatConfirmShift, formatShiftStatus } from 'src/app/helpers/shift';
import { Patient, Specialist, Admin } from 'src/app/interfaces/entities';
import { Shift } from 'src/app/interfaces/shift.interface';
import { ShiftService } from 'src/app/protected/services/shift.service';

const isValidAdminAndSpecialistShiftStatus = (shift: Shift) =>
  shift.status !== ShiftStatus.REJECTED &&
  shift.status !== ShiftStatus.ACCEPTED &&
  shift.status !== ShiftStatus.CANCELLED &&
  shift.status !== ShiftStatus.COMPLETED;

const getCommentShiftForm = () => {
  return new FormBuilder().group({
    comment: new FormControl('', [
      Validators.required,
      Validators.minLength(6),
    ]),
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

  constructor(private shiftService: ShiftService, private fb: FormBuilder) {
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

    console.log(`this.selectedShift`, this.selectedShift);

    // if (this.selectedShift && this.selectedShift.id === selectedShift.id) {
    //   this.onSelectShift.emit(null);
    //   this.selectedShift = null;
    // } else {
    //   this.onSelectShift.emit(selectedShift);
    //   this.selectedShift = selectedShift;
    // }
  }

  getErrorMessage(formControlName: string) {
    if (this.commentShiftForm.get(formControlName)?.touched) {
      if (this.commentShiftForm.get(formControlName)?.errors?.required)
        return 'Debes ingresar un valor';

      if (this.commentShiftForm.get(formControlName)?.hasError('minlength')) {
        return 'El comentario debe contener 6 caracteres como mínimo,';
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

  async onCompletedShift() {
    // TODO: me quedé en la parte de completar un turno
    /**
     * Tengo que agregar un campo más al form que sea 'diagnostico', tendré que crear un nuevo form? y hacer un if en el modal, para que muestre otro form?
     * Tengo que agregar un campo más al form que sea 'diagnostico', tendré que crear un nuevo form? y hacer un if en el modal, para que muestre otro form?
     * Tengo que agregar un campo más al form que sea 'diagnostico', tendré que crear un nuevo form? y hacer un if en el modal, para que muestre otro form?
     * Tengo que agregar un campo más al form que sea 'diagnostico', tendré que crear un nuevo form? y hacer un if en el modal, para que muestre otro form?
     */
  }
}
