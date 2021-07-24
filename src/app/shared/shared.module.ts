import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { RecaptchaModule, RecaptchaFormsModule } from 'ng-recaptcha';

// Components
import { SpinnerComponent } from './components/spinner/spinner.component';

// Forms
import { PatientFormComponent } from './components/patient-form/patient-form.component';
import { SpecialistFormComponent } from './components/specialist-form/specialist-form.component';
import { AdminFormComponent } from './components/admin-form/admin-form.component';

// Tables
import { UsersTableComponent } from './components/tables/users-table/users-table.component';
import { ShiftScheduleTableComponent } from './components/tables/shift-schedule-table/shift-schedule-table.component';

// Autocomplete
import { AutocompleteLibModule } from 'angular-ng-autocomplete';
import { FinderComponent } from './components/finder/finder.component';
import { ListComponent } from './components/list/list.component';
import { SearchBarComponent } from './components/search-bar/search-bar.component';

// Finders
import { SpecialtyFinderComponent } from './components/finders/specialty-finder/specialty-finder.component';

// Card
import { EmptyCardComponent } from './components/cards/empty-card/empty-card.component';

@NgModule({
  declarations: [
    // Forms
    PatientFormComponent,
    SpecialistFormComponent,
    AdminFormComponent,
    // Components
    SpinnerComponent,
    UsersTableComponent,
    FinderComponent,
    ListComponent,
    SearchBarComponent,
    SpecialtyFinderComponent,
    ShiftScheduleTableComponent,
    EmptyCardComponent,
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    RecaptchaModule,
    RecaptchaFormsModule,
    AutocompleteLibModule,
  ],
  exports: [
    PatientFormComponent,
    SpecialistFormComponent,
    AdminFormComponent,
    SpinnerComponent,
    SearchBarComponent,
    // Tables
    UsersTableComponent,
    ShiftScheduleTableComponent,
    // Finders
    SpecialtyFinderComponent,
    // Cards
    EmptyCardComponent,
  ],
})
export class SharedModule {}
