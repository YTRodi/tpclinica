import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/auth/services/auth.service';
import { Roles } from 'src/app/constants/roles';

@Component({
  selector: 'app-my-profile',
  templateUrl: './my-profile.component.html',
  styleUrls: ['./my-profile.component.css'],
})
export class MyProfileComponent implements OnInit {
  public currentUserFromDB: any;
  public isPatient: boolean;
  public isSpecialist: boolean;
  public isAdmin: boolean;

  constructor(private authService: AuthService) {
    this.currentUserFromDB = null;
    this.isPatient = false;
    this.isSpecialist = false;
    this.isAdmin = false;
  }

  async ngOnInit(): Promise<void> {
    const { currentUserFromDB } = await this.authService.getCurrentUser();
    this.currentUserFromDB = currentUserFromDB;

    this.isPatient = this.currentUserFromDB.role === Roles.PATIENT;
    this.isSpecialist = this.currentUserFromDB.role === Roles.SPECIALIST;
    this.isAdmin = this.currentUserFromDB.role === Roles.ADMIN;
  }
}
