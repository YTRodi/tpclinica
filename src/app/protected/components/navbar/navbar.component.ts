import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import firebase from 'firebase/app';
import { AuthService } from 'src/app/auth/services/auth.service';
import { Roles } from 'src/app/constants/roles';
import { NavI } from '../../interfaces/nav';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
})
export class NavbarComponent implements OnInit {
  public currentUser: firebase.User | null;
  public currentUserFromDB: any | null;

  public isPatient: boolean;
  public isSpecialist: boolean;
  public isAdmin: boolean;

  public navPatient: NavI[] = [
    { to: '/auth/register', routeName: 'Mis turnos' },
    { to: '/auth/register', routeName: 'Solicitar turno' },
    { to: '/my-profile', routeName: 'Mi Perfil' },
  ];

  public navSpecialist: NavI[] = [
    { to: '/auth/register', routeName: 'Mis turnos' },
    { to: '/my-profile', routeName: 'Mi Perfil' },
  ];

  public navAdmin: NavI[] = [
    { to: '/admin/users', routeName: 'Usuarios' },
    { to: '/admin/users', routeName: 'Turnos' },
    { to: '/auth/register', routeName: 'Solicitar turno' },
    { to: '/my-profile', routeName: 'Mi Perfil' },
  ];

  constructor(public authService: AuthService, private router: Router) {
    this.currentUser = null;
    this.currentUserFromDB = null;
    this.isPatient = false;
    this.isSpecialist = false;
    this.isAdmin = false;
  }

  async ngOnInit(): Promise<void> {
    const { currentUser, currentUserFromDB } =
      await this.authService.getCurrentUser();
    this.currentUser = currentUser;
    this.currentUserFromDB = currentUserFromDB;

    this.isPatient = this.currentUserFromDB.role === Roles.PATIENT;
    this.isSpecialist = this.currentUserFromDB.role === Roles.SPECIALIST;
    this.isAdmin = this.currentUserFromDB.role === Roles.ADMIN;
  }

  onLogout() {
    this.authService.logout();
    this.router.navigate(['/auth/login']);
  }
}
