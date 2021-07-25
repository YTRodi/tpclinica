import { Component, Input, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { RecaptchaErrorParameters } from 'ng-recaptcha';
import { AuthService } from 'src/app/auth/services/auth.service';
import { SpecialtiesService } from 'src/app/auth/services/specialties.service';
import { UserService } from 'src/app/auth/services/user.service';
import { FolderImages } from 'src/app/constants/images';
import { Roles } from 'src/app/constants/roles';
import { getSpecialistForm } from 'src/app/forms/users';
import { errorNotification } from 'src/app/helpers/notifications';
import { Specialist } from 'src/app/interfaces/entities';

@Component({
  selector: 'app-specialist-form',
  templateUrl: './specialist-form.component.html',
  styleUrls: ['./specialist-form.component.css'],
})
export class SpecialistFormComponent implements OnInit {
  @Input() textSubmitButton: string;
  @Input() isAdminRegister: boolean;
  public specialistRegisterForm: FormGroup;
  public listSpecialties: Array<any>;
  public errorAddSpecialty: string | null;
  public isLoading: boolean;
  private photo: any;

  constructor(
    private authService: AuthService,
    private userService: UserService,
    private specialtiesService: SpecialtiesService,
    private router: Router,
    private fb: FormBuilder
  ) {
    this.textSubmitButton = 'Unirse';
    this.specialistRegisterForm = getSpecialistForm();
    this.isAdminRegister = false;
    this.listSpecialties = [];
    this.errorAddSpecialty = null;
    this.isLoading = false;
  }

  ngOnInit(): void {
    this.specialtiesService.getAllSpecialties().subscribe((data) => {
      this.listSpecialties = data;
    });
  }

  getErrorMessage(formControlName: string) {
    if (this.specialistRegisterForm.get(formControlName)?.touched) {
      if (this.specialistRegisterForm.get(formControlName)?.errors?.required)
        return 'Debes ingresar un valor';

      // minLength - maxLength
      if (
        formControlName !== 'password' && // firstName and lastName
        this.specialistRegisterForm.get(formControlName)?.hasError('minlength')
      ) {
        return 'Debe de contener 2 caracteres como mínimo';
      }

      if (
        formControlName === 'password' &&
        this.specialistRegisterForm.get(formControlName)?.hasError('minlength')
      )
        return 'Debe de contener 6 caracteres como mínimo';

      if (
        this.specialistRegisterForm.get(formControlName)?.hasError('maxlength')
      )
        return 'Debe de contener 20 caracteres como máximo';

      // min - max
      if (formControlName === 'age') {
        if (this.specialistRegisterForm.get(formControlName)?.errors?.min)
          return 'La edad debe ser como mínimo de 1 años';
        else if (this.specialistRegisterForm.get(formControlName)?.errors?.max)
          return 'La edad debe ser como máximo de 99 años';
      }

      if (formControlName === 'dni') {
        if (this.specialistRegisterForm.get(formControlName)?.errors?.min)
          return 'El dni debe ser como mínimo de 11111111 (8 digitos)';
        else if (this.specialistRegisterForm.get(formControlName)?.errors?.max)
          return 'El dni debe ser como máximo de 99999999 (8 digitos)';
      }

      if (this.specialistRegisterForm.get(formControlName)?.hasError('email'))
        return 'Email no válido';
    }

    return '';
  }

  handlePhoto(event: any): void {
    this.photo = event.target.files[0];
  }

  public resolved(captchaResponse: string): void {
    console.log(`Resolved captcha with response: ${captchaResponse}`);
  }

  public onError(errorDetails: RecaptchaErrorParameters): void {
    console.log(`reCAPTCHA error encountered; details:`, errorDetails);
  }

  get specialties() {
    return this.specialistRegisterForm.get('specialties') as FormArray;
  }

  addSpecialty() {
    this.specialties.push(
      this.fb.control('', [Validators.required, Validators.minLength(6)])
    );
  }

  removeSpecialty(index: number) {
    this.specialties.removeAt(index);
  }

  async sendSpecialistForm() {
    this.isLoading = true;

    const { firstName, lastName, age, dni, email, password, specialties } =
      this.specialistRegisterForm.getRawValue();

    specialties.forEach((element: any) => {
      if (!element.id) {
        this.specialtiesService.addSpecialty({ name: element });
      }
    });

    const newSpecialist: Specialist = {
      firstName,
      lastName,
      age,
      dni,
      email,
      specialties,
      role: Roles.SPECIALIST,
      active: false,
    };

    console.log(`newSpecialist`, newSpecialist);

    try {
      const user = await this.authService.registerWithEmailAndPassword(
        email,
        password,
        newSpecialist,
        this.isAdminRegister
      );

      if (!this.isAdminRegister) {
        this.userService.preAddAndUploadImage(
          { ...newSpecialist, userUid: user.uid },
          FolderImages.users,
          [this.photo]
        );
        this.router.navigate(['auth/verification-email']);
      } else {
        // Si es admin, se saltea la verificación de email
        this.userService.preAddAndUploadImage(
          { ...newSpecialist, active: true, userUid: user.uid },
          FolderImages.users,
          [this.photo]
        );
      }

      this.specialistRegisterForm.reset();
    } catch (error) {
      errorNotification({ text: error.message });
      this.isLoading = true;
    } finally {
      this.isLoading = false;
    }
  }
}
