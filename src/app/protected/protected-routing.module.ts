import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { HomeComponent } from './pages/home/home.component';

import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { RequestShiftComponent } from './pages/request-shift/request-shift.component';
import { MyProfileComponent } from './pages/my-profile/my-profile.component';
import { MyShiftsComponent } from './pages/my-shifts/my-shifts.component';

// Admin
import { UsersComponent } from './pages/admin/users/users.component';
import { ShiftsAdminComponent } from './pages/admin/shifts-admin/shifts-admin.component';

const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
    children: [
      { path: 'dashboard', component: DashboardComponent },
      { path: 'request-shift', component: RequestShiftComponent },
      { path: 'my-profile', component: MyProfileComponent },
      { path: 'my-shifts', component: MyShiftsComponent },
      {
        path: 'admin',
        children: [
          { path: 'users', component: UsersComponent },
          { path: 'shifts', component: ShiftsAdminComponent },
        ],
      },
    ],
  },
  { path: '**', redirectTo: 'dashboard' },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ProtectedRoutingModule {}
