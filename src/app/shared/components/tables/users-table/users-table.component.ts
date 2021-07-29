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
import {
  confirmNotification,
  successNotification,
} from 'src/app/helpers/notifications';
import { AuthService } from 'src/app/auth/services/auth.service';
import { ShiftService } from 'src/app/protected/services/shift.service';
import { Shift } from 'src/app/interfaces/shift.interface';

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
  @Output() onSelectUser: EventEmitter<Patient | Specialist | Admin | null>;
  public currentUserFromDB: Patient | Specialist | Admin | null = null;
  public roles = Roles;
  public userList: Array<Patient | Specialist | Admin> | null = null;
  public existsUsersFindBySpecialty: boolean = false;

  // Finder
  public searchString: string;
  public copyList: Array<Patient | Specialist | Admin> | null = null;
  public selectedUser: Patient | Specialist | Admin | null = null;

  constructor(
    private authService: AuthService,
    private userService: UserService,
    private shiftService: ShiftService
  ) {
    this.onSelectUser = new EventEmitter<Patient | Specialist | Admin | null>();
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
    if (this.selectedUser && this.selectedUser.uid === selectedUser.uid) {
      this.onSelectUser.emit(null);
      this.selectedUser = null;
    } else {
      this.onSelectUser.emit(selectedUser);
      this.selectedUser = selectedUser;
    }
  }

  async onActiveUser(user: Patient | Specialist | Admin) {
    if (user.role === Roles.SPECIALIST) {
      const confirm = await confirmNotification({
        text: !user.active
          ? `Habilitar cuenta al especialista ${user.firstName} ${user.lastName}`
          : `Deshabilitar cuenta al especialista ${user.firstName} ${user.lastName}`,
      });

      if (confirm) {
        this.userService.updateData({
          ...user,
          active: !user.active,
        });

        successNotification({
          title: !user.active
            ? 'Cuenta habilitada con éxito'
            : 'Cuenta deshabilitada con éxito',
        });
      }
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
    });

    if (confirm) {
      await this.userService.deleteUser(user.uid);

      successNotification({ title: 'Usuario eliminado con éxito' });
    }
  }

  async onFindUserBySpecialty(specialty: {
    id: string;
    name: string;
  }): Promise<any> {
    // console.log(`this.currentUserFromDB`, this.currentUserFromDB);
    const result = await this.userService.getUsersBySpecialty(specialty);

    /**
     * TODO: Cuando toco una especialidad, se filtra la tabla de usuarios con 'especialistas' ya que ellso tienen un array de especialidades,
     * tendría que hacer otra query para traer los usarios que matcheen con la specialty que vinee por parámetro
     */

    /**
     * Idea:
     * Si el currentUserFromDB es especialista, uso el shiftService y me traigo los usuarios que tengan turno con ese especialista
     * y con la especialidad que viene por parámetro.
     */

    // Seguir probando...
    // if (this.currentUserFromDB?.role === Roles.SPECIALIST) {
    //   const shiftsBySpecialty = await this.shiftService.getShiftsBySpecialty(
    //     specialty
    //   );

    //   return shiftsBySpecialty.subscribe((shifts: Shift[]) => {
    //     console.log(`shifts`, shifts);
    //     const filteredShiftsByUser = null;
    //   });
    // }

    result.subscribe((usersBySpecialty) => {
      console.log(`usersBySpecialty`, usersBySpecialty);

      if (usersBySpecialty.length === 0) {
        this.existsUsersFindBySpecialty = true;
        this.userList = [];
        this.copyList = [];
        this.onSelectUser.emit(null);
      } else {
        this.existsUsersFindBySpecialty = false;
        this.userList = usersBySpecialty;
        this.copyList = usersBySpecialty;
      }
    });
  }
}
