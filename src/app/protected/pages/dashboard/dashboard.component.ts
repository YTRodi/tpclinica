import { Component, OnInit } from '@angular/core';
import { ShiftService } from '../../services/shift.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
})
export class DashboardComponent implements OnInit {
  constructor(private shiftService: ShiftService) {}

  ngOnInit(): void {}

  getShifts() {
    // TODO: Hacer algo asi para la solicitd de turnos.
    this.shiftService.getAllShifts().subscribe((data) => console.log(data[0]));
  }
}
