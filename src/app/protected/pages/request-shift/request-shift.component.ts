import { Component, OnInit } from '@angular/core';
import { SpecialtyI } from 'src/app/auth/interfaces/specialty';

@Component({
  selector: 'app-request-shift',
  templateUrl: './request-shift.component.html',
  styleUrls: ['./request-shift.component.css'],
})
export class RequestShiftComponent implements OnInit {
  public selectedSpecialty: SpecialtyI | null = null;

  constructor() {}

  ngOnInit(): void {}

  setSelectedSpecialty(specialty: SpecialtyI) {
    this.selectedSpecialty = specialty;
  }
}
