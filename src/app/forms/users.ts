import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';

export const getPatientForm = () => {
  return new FormBuilder().group({
    firstName: new FormControl(null, [
      Validators.required,
      Validators.minLength(2),
    ]),
    lastName: new FormControl(null, [
      Validators.required,
      Validators.minLength(2),
    ]),
    age: new FormControl(null, [
      Validators.required,
      Validators.min(1),
      Validators.max(99),
    ]),
    dni: new FormControl(null, [
      Validators.required,
      Validators.min(11111111),
      Validators.max(99999999),
    ]),
    email: new FormControl(null, [Validators.required, Validators.email]),
    password: new FormControl(null, [
      Validators.required,
      Validators.minLength(6),
      Validators.maxLength(20),
    ]),
    photo: new FormControl(null, [Validators.required]),
    photo2: new FormControl(null, [Validators.required]),
    medicalAssistance: new FormControl(null, [Validators.minLength(2)]),
    recaptcha: new FormControl(null, [Validators.required]),
  });
};

export const getSpecialistForm = () => {
  return new FormBuilder().group({
    firstName: new FormControl(null, [
      Validators.required,
      Validators.minLength(2),
    ]),
    lastName: new FormControl(null, [
      Validators.required,
      Validators.minLength(2),
    ]),
    age: new FormControl(null, [
      Validators.required,
      Validators.min(1),
      Validators.max(99),
    ]),
    dni: new FormControl(null, [
      Validators.required,
      Validators.min(11111111),
      Validators.max(99999999),
    ]),
    email: new FormControl(null, [Validators.required, Validators.email]),
    password: new FormControl(null, [
      Validators.required,
      Validators.minLength(6),
      Validators.maxLength(20),
    ]),
    photo: new FormControl(null, [Validators.required]),
    specialties: new FormArray(
      [new FormControl('', [Validators.required])],
      [Validators.required]
    ),
    recaptcha: new FormControl(null, [Validators.required]),
  });
};

export const getAdminForm = () => {
  return new FormBuilder().group({
    firstName: new FormControl('JUAN', [
      Validators.required,
      Validators.minLength(2),
    ]),
    lastName: new FormControl('RAMIREZ', [
      Validators.required,
      Validators.minLength(2),
    ]),
    age: new FormControl(18, [
      Validators.required,
      Validators.min(1),
      Validators.max(99),
    ]),
    dni: new FormControl(12345678, [
      Validators.required,
      Validators.min(11111111),
      Validators.max(99999999),
    ]),
    email: new FormControl('juanramirez@gmail.com', [
      Validators.required,
      Validators.email,
    ]),
    password: new FormControl('123456', [
      Validators.required,
      Validators.minLength(6),
      Validators.maxLength(20),
    ]),
    photo: new FormControl(null, [Validators.required]),
  });
};
