import { Component, Input, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { UserService } from 'src/app/auth/services/user.service';
import { Specialist, Patient, Admin } from 'src/app/interfaces/entities';
import { Roles } from 'src/app/constants/roles';
import { confirmNotification } from 'src/app/helpers/notifications';

@Component({
  selector: 'app-users-table',
  templateUrl: './users-table.component.html',
  styleUrls: ['./users-table.component.css'],
})
export class UsersTableComponent implements OnInit {
  @Input() users$: Observable<any> | null;

  constructor(private userService: UserService) {
    this.users$ = null;
  }

  ngOnInit(): void {}

  async selectUser(user: Specialist | Patient | Admin) {
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
        this.userService.updateData({ ...user, active: !user.active });
    }
  }
}
