import { Component, OnInit } from '@angular/core';
import {
  FormGroup,
  FormBuilder,
  FormControl,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import firebase from 'firebase';
import { Roles } from 'src/app/constants/roles';
import { errorNotification } from 'src/app/helpers/notifications';
import { AuthService } from '../../services/auth.service';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  public loginForm: FormGroup;
  public isDefaultLogin: boolean = false;
  public isGoogleLogin: boolean = false;
  public userFromDB: any = null;

  public userAdmin: any = null;
  public userPatient: any = null;
  public userSpecialist: any = null;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private userService: UserService,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [
        Validators.required,
        Validators.minLength(6),
        Validators.maxLength(20),
      ]),
    });
  }

  async ngOnInit(): Promise<void> {
    this.userAdmin = (
      await this.userService.getUserByEmail('yagorodi@gmail.com')
    )[0];

    this.userPatient = (
      await this.userService.getUserByEmail('escleur@gmail.com')
    )[0];

    this.userSpecialist = (
      await this.userService.getUserByEmail('camilaroy99@gmail.com')
    )[0];
  }

  getErrorMessage(formControlName: string) {
    if (this.loginForm.get(formControlName)?.touched) {
      if (this.loginForm.get(formControlName)?.errors?.required)
        return 'Debes ingresar un valor';

      if (this.loginForm.get(formControlName)?.hasError('email'))
        return 'Email no válido';
    }

    return '';
  }

  async onLogin() {
    this.isDefaultLogin = true;

    try {
      const { email, password } = this.loginForm.getRawValue();
      const user = await this.authService.loginWithEmailAndPassword(
        email,
        password
      );

      if (user) {
        this.userFromDB = (await this.userService.getUserByEmail(email))[0];

        if (this.userFromDB.role === Roles.ADMIN) {
          this.router.navigate(['dashboard']);
        } else {
          if (this.userFromDB.active) {
            this.checkUserIsVerified(user);
            this.loginForm.reset();
          } else {
            this.router.navigate(['auth/active-account']);
          }
        }

        this.isDefaultLogin = false;
      }
    } catch (error) {
      errorNotification({ text: error.message });
      this.isDefaultLogin = false;
    }
  }

  checkUserIsVerified(user: firebase.User) {
    if (user && user.emailVerified) {
      this.router.navigate(['dashboard']);
    } else if (user) {
      this.router.navigate(['auth/verification-email']);
    }
  }

  async loadAdmin() {
    this.loginForm.get('email')?.setValue(this.userAdmin?.email);
    this.loginForm.get('password')?.setValue('123456');
  }

  loadPatient() {
    this.loginForm.get('email')?.setValue(this.userPatient?.email);
    this.loginForm.get('password')?.setValue('123456');
  }

  loadSpecialist() {
    this.loginForm.get('email')?.setValue(this.userSpecialist?.email);
    this.loginForm.get('password')?.setValue('123456');
  }

  loginWithGoogle() {
    this.isGoogleLogin = true;

    console.log('google');
  }
}
