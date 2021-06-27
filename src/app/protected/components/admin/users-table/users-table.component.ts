import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { UserService } from 'src/app/auth/services/user.service';
import { Specialist, Patient, Admin } from 'src/app/interfaces/entities';
import { Roles } from 'src/app/constants/roles';
import { confirmNotification } from 'src/app/helpers/notifications';
import { AuthService } from 'src/app/auth/services/auth.service';

@Component({
  selector: 'app-users-table',
  templateUrl: './users-table.component.html',
  styleUrls: ['./users-table.component.css'],
})
export class UsersTableComponent implements OnInit {
  // Buttons
  @Input() showDeleteButton: boolean = true;
  @Input() showActiveButton: boolean = true;

  // Fields
  @Input() showRole: boolean = true;
  @Input() title: string = 'usuarios';
  @Input() filter: 'PATIENT' | 'SPECIALIST' | 'ADMIN' | 'ALL' = 'ALL';
  @Output() onSelectUser: EventEmitter<Patient | Specialist | Admin>;
  public currentUserFromDB: Patient | Specialist | Admin | null = null;
  public roles = Roles;

  public userList: Array<Patient | Specialist | Admin> | null = null;

  constructor(
    private authService: AuthService,
    private userService: UserService
  ) {
    this.onSelectUser = new EventEmitter<Patient | Specialist | Admin>();
  }

  async ngOnInit(): Promise<void> {
    switch (this.filter) {
      case 'ALL':
        this.userService
          .getAllUsers()
          .subscribe((userList) => (this.userList = userList));
        break;

      case Roles.PATIENT:
        (await this.userService.getAllUsersByRole(this.filter)).subscribe(
          (onlyPatients) => (this.userList = onlyPatients)
        );
        break;

      case Roles.SPECIALIST:
        (await this.userService.getAllUsersByRole(this.filter)).subscribe(
          (onlySpecialists) => (this.userList = onlySpecialists)
        );
        break;

      case Roles.ADMIN:
        (await this.userService.getAllUsersByRole(this.filter)).subscribe(
          (onlyAdmins) => (this.userList = onlyAdmins)
        );
        break;
    }

    const { currentUserFromDB } = await this.authService.getCurrentUser();
    this.currentUserFromDB = currentUserFromDB;
  }

  async selectUser(selectedUser: Patient | Specialist | Admin) {
    this.onSelectUser.emit(selectedUser);
  }

  async onActiveUser(user: Patient | Specialist | Admin) {
    if (user.role === Roles.SPECIALIST) {
      const confirm = await confirmNotification({
        text: !user.active
          ? `Habilitar cuenta al especialista ${user.firstName} ${user.lastName}`
          : `Deshabilitar cuenta al especialista ${user.firstName} ${user.lastName}`,
        confirmParams: {
          title: !user.active
            ? 'Cuenta habilitada con éxito'
            : 'Cuenta deshabilitada con éxito',
        },
      });

      if (confirm)
        this.userService.updateData({
          ...user,
          active: !user.active,
        });
    }
  }

  async onDeleteUser(user: Patient | Specialist | Admin) {
    const userRole =
      user.role === Roles.PATIENT
        ? 'paciente'
        : user.role === Roles.SPECIALIST
        ? 'especialista'
        : 'admin';

    const confirm = await confirmNotification({
      text: `Eliminar ${userRole} con email ${user.email}`,
      confirmParams: { title: 'Usuario eliminado con éxito' },
    });
    if (confirm) this.userService.deleteUser(user.uid);
  }
}
