import { Component, Input, OnInit } from '@angular/core';
import {
  FormBuilder,
  Validators,
  FormGroup,
  FormArray,
  FormControl,
} from '@angular/forms';
import {
  errorNotification,
  successNotification,
} from 'src/app/helpers/notifications';

import { ShiftService } from '../../services/shift.service';

export const getScheduleForm = () => {
  return new FormBuilder().group({
    specialty: new FormControl('', [Validators.required]),
    days: new FormArray([], [Validators.required]),
    from: new FormControl('', [Validators.required]),
    to: new FormControl('', [Validators.required]),
    duration: new FormControl('', [Validators.required]),
  });
};

@Component({
  selector: 'app-schedule-card',
  templateUrl: './schedule-card.component.html',
  styleUrls: ['./schedule-card.component.css'],
})
export class ScheduleCardComponent implements OnInit {
  @Input() currentUserFromDB: any;
  public shiftForm: FormGroup;
  public weekDays = [
    { id: 1, value: 'Lunes' },
    { id: 2, value: 'Martes' },
    { id: 3, value: 'Miércoles' },
    { id: 4, value: 'Jueves' },
    { id: 5, value: 'Viernes' },
    { id: 6, value: 'Sábado' },
  ];

  public clinicHours = [8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19];

  constructor(private shiftService: ShiftService) {
    this.shiftForm = getScheduleForm();
    // this.shiftService
    //   .getAllShifts()
    //   .subscribe((data) => console.log(new Date(data[2].day)));
  }

  get days() {
    return this.shiftForm.get('days') as FormArray;
  }

  async ngOnInit(): Promise<any> {}

  onCheckChange(event: any) {
    const parsedValue = parseInt(event.target.value);

    if (event.target.checked) {
      this.days.push(new FormControl(parsedValue));
    } else {
      this.days.controls.forEach((control, index) => {
        if (control.value === parsedValue) {
          return this.days.removeAt(index);
        }
      });
    }
  }

  getErrorMessage(formControlName: string) {
    if (this.shiftForm.get(formControlName)?.touched) {
      if (this.shiftForm.get(formControlName)?.errors?.required)
        return 'Debes ingresar un valor';

      // min - max
      if (this.shiftForm.get(formControlName)?.errors?.min)
        return 'El horario mínimo es a las 8 am';
      else if (this.shiftForm.get(formControlName)?.errors?.max)
        return 'El horario máximo es a las 19 pm';
    }

    return '';
  }

  sendScheduletForm() {
    const result = this.shiftForm.getRawValue();

    const updatedResult = {
      ...result,
      from: parseInt(result.from),
      to: parseInt(result.to),
      duration: parseInt(result.duration),
    };

    try {
      this.shiftService.generateShiftsByArray(
        this.weekDays,
        updatedResult,
        this.currentUserFromDB
      );

      this.shiftForm.reset();
      this.shiftForm.get('specialty')?.setValue('');
      this.shiftForm.get('from')?.setValue('');
      this.shiftForm.get('to')?.setValue('');
      this.shiftForm.get('duration')?.setValue('');

      successNotification({
        title: 'La disponibilidad fue seteada con éxito!',
        text: 'Se han generaron turnos de hoy a 21 días',
      });
    } catch (error) {
      errorNotification({ text: error.message });
    }
  }
}
