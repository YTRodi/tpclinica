import { Component, Input, OnInit } from '@angular/core';

interface roles {
  isPatient: boolean;
  isSpecialist: boolean;
  isAdmin: boolean;
}

@Component({
  selector: 'app-profile-card',
  templateUrl: './profile-card.component.html',
  styleUrls: ['./profile-card.component.css'],
})
export class ProfileCardComponent implements OnInit {
  @Input() currentUserFromDB: any = null;
  @Input() roles: roles = {
    isPatient: false,
    isSpecialist: false,
    isAdmin: false,
  };

  constructor() {}

  ngOnInit(): void {}
}
