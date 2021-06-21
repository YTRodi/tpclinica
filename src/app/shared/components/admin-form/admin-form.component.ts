import { Component, Input, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { AuthService } from 'src/app/auth/services/auth.service';
import { UserService } from 'src/app/auth/services/user.service';
import { FolderImages } from 'src/app/constants/images';
import { Roles } from 'src/app/constants/roles';
import { getAdminForm } from 'src/app/forms/users';
import { errorNotification } from 'src/app/helpers/notifications';
import { Admin } from 'src/app/interfaces/entities';

@Component({
  selector: 'app-admin-form',
  templateUrl: './admin-form.component.html',
  styleUrls: ['./admin-form.component.css'],
})
export class AdminFormComponent implements OnInit {
  @Input() textSubmitButton: string;
  @Input() isAdminRegister: boolean;
  public adminRegisterForm: FormGroup;
  public isLoading: boolean;
  private photo: any;

  constructor(
    private authService: AuthService,
    private userService: UserService
  ) {
    this.textSubmitButton = 'Agregar';
    this.adminRegisterForm = getAdminForm();
    this.isAdminRegister = false;
    this.isLoading = false;
  }

  ngOnInit(): void {}

  getErrorMessage(formControlName: string) {
    if (this.adminRegisterForm.get(formControlName)?.touched) {
      if (this.adminRegisterForm.get(formControlName)?.errors?.required)
        return 'Debes ingresar un valor';

      // minLength - maxLength
      if (
        formControlName !== 'password' && // firstName and lastName
        this.adminRegisterForm.get(formControlName)?.hasError('minlength')
      ) {
        return 'Debe de contener 2 caracteres como mínimo';
      }

      if (
        formControlName === 'password' &&
        this.adminRegisterForm.get(formControlName)?.hasError('minlength')
      )
        return 'Debe de contener 6 caracteres como mínimo';

      if (this.adminRegisterForm.get(formControlName)?.hasError('maxlength'))
        return 'Debe de contener 20 caracteres como máximo';

      // min - max
      if (formControlName === 'age') {
        if (this.adminRegisterForm.get(formControlName)?.errors?.min)
          return 'La edad debe ser como mínimo de 1 años';
        else if (this.adminRegisterForm.get(formControlName)?.errors?.max)
          return 'La edad debe ser como máximo de 99 años';
      }

      if (formControlName === 'dni') {
        if (this.adminRegisterForm.get(formControlName)?.errors?.min)
          return 'El dni debe ser como mínimo de 11111111 (8 digitos)';
        else if (this.adminRegisterForm.get(formControlName)?.errors?.max)
          return 'El dni debe ser como máximo de 99999999 (8 digitos)';
      }

      if (this.adminRegisterForm.get(formControlName)?.hasError('email'))
        return 'Email no válido';
    }

    return '';
  }

  handlePhoto(event: any): void {
    this.photo = event.target.files[0];
  }

  async sendAdminForm() {
    this.isLoading = true;

    const { firstName, lastName, age, dni, email, password, photo } =
      this.adminRegisterForm.getRawValue();

    const newAdmin: Admin = {
      firstName,
      lastName,
      age,
      dni,
      email,
      role: Roles.ADMIN,
      active: true,
    };

    try {
      const user = await this.authService.registerWithEmailAndPassword(
        email,
        password,
        newAdmin,
        this.isAdminRegister
      );

      this.userService.preAddAndUploadImage(
        { ...newAdmin, userUid: user.uid },
        FolderImages.users,
        [this.photo]
      );

      this.adminRegisterForm.reset();
    } catch (error) {
      errorNotification({ text: error.message });
      this.isLoading = true;
    } finally {
      this.isLoading = false;
    }
  }
}
