import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

import { ProtectedRoutingModule } from './protected-routing.module';
import { HomeComponent } from './pages/home/home.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { SharedModule } from '../shared/shared.module';
import { UsersComponent } from './pages/admin/users/users.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';

import { MyProfileComponent } from './pages/my-profile/my-profile.component';
import { ProfileCardComponent } from './components/profile-card/profile-card.component';
import { ScheduleCardComponent } from './components/schedule-card/schedule-card.component';
import { RequestShiftComponent } from './pages/request-shift/request-shift.component';
import { ShiftsComponent } from './pages/admin/shifts/shifts.component';

@NgModule({
  declarations: [
    HomeComponent,
    NavbarComponent,
    UsersComponent,
    DashboardComponent,
    MyProfileComponent,
    ProfileCardComponent,
    ScheduleCardComponent,
    RequestShiftComponent,
    ShiftsComponent,
  ],
  imports: [
    CommonModule,
    ProtectedRoutingModule,
    SharedModule,
    ReactiveFormsModule,
    FormsModule,
  ],
})
export class ProtectedModule {}
