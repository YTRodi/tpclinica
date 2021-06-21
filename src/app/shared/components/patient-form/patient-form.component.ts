import { Component, Input, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { RecaptchaErrorParameters } from 'ng-recaptcha';

import { AuthService } from 'src/app/auth/services/auth.service';
import { UserService } from 'src/app/auth/services/user.service';
import { FolderImages } from 'src/app/constants/images';
import { Roles } from 'src/app/constants/roles';
import { errorNotification } from 'src/app/helpers/notifications';
import { getPatientForm } from '../../../forms/users';
import { Patient } from 'src/app/interfaces/entities';

@Component({
  selector: 'app-patient-form',
  templateUrl: './patient-form.component.html',
  styleUrls: ['./patient-form.component.css'],
})
export class PatientFormComponent implements OnInit {
  @Input() textSubmitButton: string;
  @Input() isAdminRegister: boolean;
  public patientRegisterForm: FormGroup;
  public isLoading: boolean;
  private photo: any;
  private photo2: any;

  constructor(
    private authService: AuthService,
    private userService: UserService,
    private router: Router
  ) {
    this.textSubmitButton = 'Unirse';
    this.patientRegisterForm = getPatientForm();
    this.isAdminRegister = false;
    this.isLoading = false;
  }

  ngOnInit(): void {}

  getErrorMessage(formControlName: string) {
    if (this.patientRegisterForm.get(formControlName)?.touched) {
      if (this.patientRegisterForm.get(formControlName)?.errors?.required)
        return 'Debes ingresar un valor';

      // minLength - maxLength
      if (
        formControlName !== 'password' && // firstName and lastName
        this.patientRegisterForm.get(formControlName)?.hasError('minlength')
      ) {
        return 'Debe de contener 2 caracteres como mínimo';
      }

      if (
        formControlName === 'password' &&
        this.patientRegisterForm.get(formControlName)?.hasError('minlength')
      )
        return 'Debe de contener 6 caracteres como mínimo';

      if (this.patientRegisterForm.get(formControlName)?.hasError('maxlength'))
        return 'Debe de contener 20 caracteres como máximo';

      // min - max
      if (formControlName === 'age') {
        if (this.patientRegisterForm.get(formControlName)?.errors?.min)
          return 'La edad debe ser como mínimo de 1 años';
        else if (this.patientRegisterForm.get(formControlName)?.errors?.max)
          return 'La edad debe ser como máximo de 99 años';
      }

      if (formControlName === 'dni') {
        if (this.patientRegisterForm.get(formControlName)?.errors?.min)
          return 'El dni debe ser como mínimo de 11111111 (8 digitos)';
        else if (this.patientRegisterForm.get(formControlName)?.errors?.max)
          return 'El dni debe ser como máximo de 99999999 (8 digitos)';
      }

      if (this.patientRegisterForm.get(formControlName)?.hasError('email'))
        return 'Email no válido';
    }

    return '';
  }

  handlePhoto(event: any): void {
    this.photo = event.target.files[0];
  }

  handlePhoto2(event: any): void {
    this.photo2 = event.target.files[0];
  }

  public resolved(captchaResponse: string): void {
    console.log(`Resolved captcha with response: ${captchaResponse}`);
  }

  public onError(errorDetails: RecaptchaErrorParameters): void {
    console.log(`reCAPTCHA error encountered; details:`, errorDetails);
  }

  async sendPatientForm() {
    this.isLoading = true;

    const {
      firstName,
      lastName,
      age,
      dni,
      email,
      password,
      medicalAssistance,
    } = this.patientRegisterForm.getRawValue();

    const newPatient: Patient = {
      firstName,
      lastName,
      age,
      dni,
      email,
      medicalAssistance,
      role: Roles.PATIENT,
      active: true,
    };

    try {
      const user = await this.authService.registerWithEmailAndPassword(
        email,
        password,
        newPatient,
        this.isAdminRegister
      );

      this.userService.preAddAndUploadImage(
        { ...newPatient, userUid: user.uid },
        FolderImages.users,
        [this.photo, this.photo2]
      );

      if (!this.isAdminRegister) {
        this.router.navigate(['auth/verification-email']);
      }

      this.patientRegisterForm.reset();
    } catch (error) {
      errorNotification({ text: error.message });
      this.isLoading = false;
    } finally {
      this.isLoading = false;
    }
  }
}
