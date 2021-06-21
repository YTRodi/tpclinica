import { KeyValue } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import {
  FormBuilder,
  Validators,
  FormGroup,
  FormArray,
  FormControl,
} from '@angular/forms';
import { ScheduleService } from '../../services/schedule.service';

export const getScheduleForm = () => {
  return new FormBuilder().group({
    shifts: new FormArray([]),
  });
};

@Component({
  selector: 'app-schedule-card',
  templateUrl: './schedule-card.component.html',
  styleUrls: ['./schedule-card.component.css'],
})
export class ScheduleCardComponent implements OnInit {
  @Input() currentUserFromDB: any;
  public scheduleForm: FormGroup;
  public week = [
    'Lunes',
    'Martes',
    'Miércoles',
    'Jueves',
    'Viernes',
    'Sábado',
    'Domingo',
  ];

  constructor(
    private fb: FormBuilder,
    private scheduleService: ScheduleService
  ) {
    this.scheduleForm = getScheduleForm();
  }

  ngOnInit(): void {
    this.scheduleService
      .getScheduleByEmail(this.currentUserFromDB.email)
      // .subscribe(([data]: any) => {
      .subscribe((data) => {
        if (data.length === 0) return;

        // const { shifts } = data;

        // shifts.map((shift: any) => {
        //   const control = new FormGroup({
        //     day: new FormControl(shift.day, [Validators.required]),
        //     from: new FormControl(shift.from, [Validators.required]),
        //     to: new FormControl(shift.to, [Validators.required]),
        //   });

        //   this.shifts.push(control);
        // });
      });
  }

  get shifts() {
    return this.scheduleForm.get('shifts') as FormArray;
  }

  addShift() {
    if (this.shifts.length < 7) {
      const group = new FormGroup({
        specialty: new FormControl('', [Validators.required]),
        day: new FormControl('', [Validators.required]),
        from: new FormControl('', [Validators.required]),
        to: new FormControl('', [Validators.required]),
      });

      this.shifts.push(group);
    }
  }

  removeShift(index: number) {
    this.shifts.removeAt(index);
  }

  removeDayInWeek(event: any) {
    const daySelected = event.target.value;
  }

  sendScheduletForm() {
    const { shifts } = this.scheduleForm.getRawValue();

    const newSchedule = {
      emailSpecialist: this.currentUserFromDB.email,
      user: { ...this.currentUserFromDB },
      specialties: this.currentUserFromDB.specialties,
      shifts,
    };

    // console.log(
    //   `this.scheduleForm.getRawValue()`,
    //   this.scheduleForm.getRawValue()
    // );

    console.log(`newSchedule`, newSchedule);

    // this.scheduleService.addSchedule(newSchedule);
  }
}
