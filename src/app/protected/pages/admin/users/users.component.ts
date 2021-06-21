import { Component, OnInit } from '@angular/core';

import { Observable } from 'rxjs';
import { UserService } from 'src/app/auth/services/user.service';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css'],
})
export class UsersComponent implements OnInit {
  public touched: boolean;
  public users$: Observable<any | null>;
  public isPatient: boolean;
  public isSpecialist: boolean;
  public isAdmin: boolean;

  constructor(private userService: UserService) {
    this.touched = false;
    this.users$ = this.userService.getAllUsers();
    this.isPatient = false;
    this.isSpecialist = false;
    this.isAdmin = false;
  }

  ngOnInit(): void {}

  changeFlagUserPatient() {
    this.isPatient = true;
    this.isSpecialist = false;
    this.isAdmin = false;
  }

  changeFlagUserSpecialist() {
    this.isPatient = false;
    this.isSpecialist = true;
    this.isAdmin = false;
  }

  changeFlagUserAdmin() {
    this.isPatient = false;
    this.isSpecialist = false;
    this.isAdmin = true;
  }
}
