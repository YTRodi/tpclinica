import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import firebase from 'firebase/app';
import { environment } from 'src/environments/environment';
import { UserService } from './user.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  public secondaryApp = firebase.initializeApp(
    environment.firebaseConfig,
    'Secondary'
  );
  public currentUser: firebase.User | null = null;
  public currentUserFromDB: any = null;

  constructor(
    public afAuth: AngularFireAuth,
    private userService: UserService
  ) {}

  async loginWithEmailAndPassword(
    email: string,
    password: string
  ): Promise<firebase.User | null> {
    try {
      const { user } = await this.afAuth.signInWithEmailAndPassword(
        email,
        password
      );

      return user;
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async loginWithGoogle(): Promise<firebase.auth.UserCredential> {
    try {
      const provider = new firebase.auth.GoogleAuthProvider();
      return await this.afAuth.signInWithPopup(provider);
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async registerWithEmailAndPassword(
    email: string,
    password: string,
    userParam: any,
    isAdminRegister: boolean = false
  ): Promise<any> {
    try {
      const { firstName, lastName, photo } = userParam;

      if (isAdminRegister) {
        // El admin da de alta usuarios y se salta la verificación de email.
        const { user } = await this.secondaryApp
          .auth()
          .createUserWithEmailAndPassword(email, password);

        if (user) {
          user.updateProfile({
            displayName: `${firstName} ${lastName}`,
            photoURL: photo,
          });
        }

        return user;
      } else {
        // El usuario se logea para entrar a la app.
        const { user } = await this.afAuth.createUserWithEmailAndPassword(
          email,
          password
        );

        await this.sendVerificationEmail();

        if (user) {
          user.updateProfile({
            displayName: `${firstName} ${lastName}`,
            photoURL: photo,
          });
        }

        return user;
      }
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async sendVerificationEmail(): Promise<any> {
    return (await this.afAuth.currentUser)?.sendEmailVerification();
  }

  async getCurrentUser(): Promise<any> {
    this.currentUser = await this.afAuth.currentUser;

    this.currentUserFromDB = (
      await this.userService.getUserByEmail(this.currentUser?.email)
    )[0];

    return {
      currentUser: this.currentUser,
      currentUserFromDB: this.currentUserFromDB,
    };
  }

  async logout(): Promise<void> {
    try {
      await this.afAuth.signOut();
    } catch (error) {
      throw new Error(error.message);
    }
  }
}
