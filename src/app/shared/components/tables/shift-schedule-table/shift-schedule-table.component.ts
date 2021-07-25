import { KeyValue } from '@angular/common';
import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';
import { formatShift, groupShiftsByDates } from 'src/app/helpers/shift';
import { Shift } from 'src/app/interfaces/shift.interface';

@Component({
  selector: 'app-shift-schedule-table',
  templateUrl: './shift-schedule-table.component.html',
  styleUrls: ['./shift-schedule-table.component.css'],
})
export class ShiftScheduleTableComponent implements OnInit, OnChanges {
  @Input() shifts: Shift[] | null = null;
  @Input() title: string = 'horarios';
  @Input() filter: 'PATIENT' | 'SPECIALIST' | 'ADMIN' | 'ALL' = 'ALL';
  @Output() onSelectShift: EventEmitter<Shift | null>;

  public searchString: string;
  public copyList: any[] | null = null;
  public selectedShift: Shift | null = null;

  constructor() {
    this.searchString = '';
    this.onSelectShift = new EventEmitter<Shift | null>();
  }

  ngOnInit(): void {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.shifts.currentValue) {
      this.copyList = groupShiftsByDates(changes.shifts.currentValue);
    }
  }

  originalOrder = (a: KeyValue<any, any>, b: KeyValue<any, any>): any => {
    return 0;
  };

  async selectShift(selectedShift: Shift) {
    this.selectedShift = selectedShift;
    this.onSelectShift.emit(this.selectedShift);
  }

  formatShift(shift: Shift | any): string {
    return formatShift(shift);
  }
}
