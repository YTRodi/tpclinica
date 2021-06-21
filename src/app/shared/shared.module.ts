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

// Autocomplete
import { AutocompleteLibModule } from 'angular-ng-autocomplete';
import { FinderComponent } from './components/finder/finder.component';
import { ListComponent } from './components/list/list.component';

@NgModule({
  declarations: [
    // Forms
    PatientFormComponent,
    SpecialistFormComponent,
    AdminFormComponent,
    // Components
    SpinnerComponent,
    FinderComponent,
    ListComponent,
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
  ],
})
export class SharedModule {}
