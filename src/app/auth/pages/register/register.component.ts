import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
})
export class RegisterComponent implements OnInit {
  public selected: boolean;
  public isSpecialist: boolean;

  constructor() {
    this.selected = false;
    this.isSpecialist = false;
  }

  ngOnInit(): void {}
}
