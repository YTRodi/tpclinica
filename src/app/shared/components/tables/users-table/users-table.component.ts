import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';
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
export class UsersTableComponent implements OnInit, OnChanges {
  // Find Specialists by specialty
  @Input() filterBySpecialtyParams: any = null;

  @Input() eneabledFinder: boolean = false;
  @Input() showInputFinder: boolean = false;
  @Input() showCountList: boolean = true;

  // Buttons
  @Input() showDeleteButton: boolean = true;
  @Input() showActiveButton: boolean = true;

  // Fields
  @Input() showStatusAccount: boolean = true;
  @Input() showRole: boolean = true;
  @Input() title: string = 'usuarios';
  @Input() filter: 'PATIENT' | 'SPECIALIST' | 'ADMIN' | 'ALL' = 'ALL';
  @Output() onSelectUser: EventEmitter<Patient | Specialist | Admin>;
  public currentUserFromDB: Patient | Specialist | Admin | null = null;
  public roles = Roles;
  public userList: Array<Patient | Specialist | Admin> | null = null;
  public existsUsersFindBySpecialty: boolean = false;

  // Finder
  public searchString: string;
  public copyList: Array<Patient | Specialist | Admin> | null = null;
  public selectedUser: any;

  constructor(
    private authService: AuthService,
    private userService: UserService
  ) {
    this.onSelectUser = new EventEmitter<Patient | Specialist | Admin>();
    this.searchString = '';
  }

  async ngOnInit(): Promise<void> {
    const { currentUserFromDB } = await this.authService.getCurrentUser();
    this.currentUserFromDB = currentUserFromDB;
  }

  async ngOnChanges(changes: SimpleChanges): Promise<void> {
    if (this.filterBySpecialtyParams) {
      return this.onFindUserBySpecialty(
        changes.filterBySpecialtyParams.currentValue
      );
    }

    switch (this.filter) {
      case 'ALL':
        this.userService.getAllUsers().subscribe((userList) => {
          this.userList = userList;
          this.copyList = userList;
        });
        break;

      case Roles.PATIENT:
        (await this.userService.getAllUsersByRole(this.filter)).subscribe(
          (onlyPatients) => {
            this.userList = onlyPatients;
            this.copyList = onlyPatients;
          }
        );
        break;

      case Roles.SPECIALIST:
        (await this.userService.getAllUsersByRole(this.filter)).subscribe(
          (onlySpecialists) => {
            this.userList = onlySpecialists;
            this.copyList = onlySpecialists;
          }
        );
        break;

      case Roles.ADMIN:
        (await this.userService.getAllUsersByRole(this.filter)).subscribe(
          (onlyAdmins) => {
            this.userList = onlyAdmins;
            this.copyList = onlyAdmins;
          }
        );
        break;
    }
  }

  filterByInputValue() {
    this.copyList = this.userList;

    if (this.copyList) {
      const filteredList = this.copyList.filter(
        (user: Patient | Specialist | Admin) => {
          return (
            user.firstName
              .toLowerCase()
              .includes(this.searchString.toLowerCase()) ||
            user.lastName
              .toLowerCase()
              .includes(this.searchString.toLowerCase()) ||
            user.email.toLowerCase().includes(this.searchString.toLowerCase())
          );
        }
      );

      this.copyList = filteredList;
    }
  }

  async selectUser(selectedUser: Patient | Specialist | Admin) {
    this.onSelectUser.emit(selectedUser);
    this.selectedUser = selectedUser;
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

  async onFindUserBySpecialty(specialty: { id: string; name: string }) {
    const result = await this.userService.getUsersBySpecialty(specialty);

    result.subscribe((usersBySpecialty) => {
      if (usersBySpecialty.length === 0) {
        this.existsUsersFindBySpecialty = true;
        this.userList = [];
        this.copyList = [];
        this.onSelectUser.emit(undefined);
      } else {
        this.existsUsersFindBySpecialty = false;
        this.userList = usersBySpecialty;
        this.copyList = usersBySpecialty;
      }
    });
  }
}
