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
  public scheduleDocExits: boolean;

  constructor(private scheduleService: ScheduleService) {
    this.scheduleForm = getScheduleForm();
    this.scheduleDocExits = false;
  }

  get shifts() {
    return this.scheduleForm.get('shifts') as FormArray;
  }

  async ngOnInit(): Promise<any> {
    const result = await this.scheduleService.getScheduleByEmail(
      this.currentUserFromDB.email
    );

    result.subscribe((schedules: any) => {
      const data = schedules[0];
      this.shifts.clear();

      if (data) {
        this.scheduleForm.setControl('uid', new FormControl(data.uid));
        this.scheduleDocExits = true;

        if (data.shifts) {
          data.shifts.map((shift: any) => {
            const group = new FormGroup({
              specialty: new FormControl(shift.specialty, [
                Validators.required,
              ]),
              from: new FormControl(shift.from),
              to: new FormControl(shift.to),
            });

            this.shifts.push(group);
            this.scheduleForm;
          });

          return;
        }
      } else {
        this.currentUserFromDB.specialties.map((specialty: any) => {
          const group = new FormGroup({
            specialty: new FormControl(specialty.name, [Validators.required]),
            from: new FormControl(null),
            to: new FormControl(null),
          });

          this.shifts.push(group);
        });

        return;
      }
    });
  }

  sendScheduletForm() {
    const result = this.scheduleForm.getRawValue();
    const newSchedule = {
      user: { ...this.currentUserFromDB },
      ...result,
      createAt: new Date().toISOString(),
    };

    if (this.scheduleDocExits) {
      this.scheduleService.updateData(newSchedule);
    } else {
      this.scheduleService.addSchedule(newSchedule);
    }
  }
}
