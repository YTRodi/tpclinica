import { Component, OnDestroy } from '@angular/core';
import firebase from 'firebase';
import { Observable } from 'rxjs';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-verification-email',
  templateUrl: './verification-email.component.html',
  styleUrls: ['./verification-email.component.css'],
})
export class VerificationEmailComponent implements OnDestroy {
  public userEmail: string | null;
  public user$: Observable<firebase.User | null>;

  constructor(private authService: AuthService) {
    this.user$ = this.authService.afAuth.user;
    this.userEmail = '';
    this.user$.subscribe((currentUser) => {
      if (currentUser) this.userEmail = currentUser.email;
    });
  }

  ngOnInit(): void {}

  onSendEmail() {
    this.authService.sendVerificationEmail();
  }

  ngOnDestroy(): void {
    this.authService.logout();
  }
}
