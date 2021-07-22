import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';
import { formatShift } from 'src/app/helpers/shift';
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
  public copyList: Shift[] | null = null;
  public selectedShift: Shift | null = null;

  constructor() {
    this.searchString = '';
    this.onSelectShift = new EventEmitter<Shift | null>();
  }

  ngOnInit(): void {}

  ngOnChanges(changes: SimpleChanges): void {
    this.copyList = changes.shifts.currentValue;
  }

  filterByInputValue() {
    this.copyList = this.shifts;

    if (this.copyList) {
      // const filteredList = this.copyList.filter(
      //   (user: Patient | Specialist | Admin) => {
      //     return (
      //       user.firstName
      //         .toLowerCase()
      //         .includes(this.searchString.toLowerCase()) ||
      //       user.lastName
      //         .toLowerCase()
      //         .includes(this.searchString.toLowerCase()) ||
      //       user.email.toLowerCase().includes(this.searchString.toLowerCase())
      //     );
      //   }
      // );
      // this.copyList = filteredList;
    }
  }

  async selectShift(selectedShift: Shift) {
    if (this.selectedShift && this.selectedShift.id === selectedShift.id) {
      this.onSelectShift.emit(null);
      this.selectedShift = null;
    } else {
      this.onSelectShift.emit(selectedShift);
      this.selectedShift = selectedShift;
    }
  }

  formatShift(shift: Shift): string {
    return formatShift(shift);
  }
}
