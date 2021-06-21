import { FormBuilder, FormControl, Validators } from '@angular/forms';

export const getPatientForm = () => {
  return new FormBuilder().group({
    firstName: new FormControl('Camila', [
      Validators.required,
      Validators.minLength(2),
    ]),
    lastName: new FormControl('Roy', [
      Validators.required,
      Validators.minLength(2),
    ]),
    age: new FormControl(22, [
      Validators.required,
      Validators.min(1),
      Validators.max(99),
    ]),
    dni: new FormControl(12345678, [
      Validators.required,
      Validators.min(11111111),
      Validators.max(99999999),
    ]),
    email: new FormControl('camilaroy99@gmail.com', [
      Validators.required,
      Validators.email,
    ]),
    password: new FormControl('123456', [
      Validators.required,
      Validators.minLength(6),
      Validators.maxLength(20),
    ]),
    photo: new FormControl(null, [Validators.required]),
    photo2: new FormControl(null, [Validators.required]),
    medicalAssistance: new FormControl('Swiss Medical', [
      Validators.required,
      Validators.minLength(2),
    ]),
    recaptcha: new FormControl(null, [Validators.required]),
  });
};

export const getSpecialistForm = () => {
  return new FormBuilder().group({
    firstName: new FormControl('Camila', [
      Validators.required,
      Validators.minLength(2),
    ]),
    lastName: new FormControl('Roy', [
      Validators.required,
      Validators.minLength(2),
    ]),
    age: new FormControl(22, [
      Validators.required,
      Validators.min(1),
      Validators.max(99),
    ]),
    dni: new FormControl(12345678, [
      Validators.required,
      Validators.min(11111111),
      Validators.max(99999999),
    ]),
    email: new FormControl('camilaroy99@gmail.com', [
      Validators.required,
      Validators.email,
    ]),
    password: new FormControl('123456', [
      Validators.required,
      Validators.minLength(6),
      Validators.maxLength(20),
    ]),
    photo: new FormControl(null, [Validators.required]),
    specialties: new FormBuilder().array([null], [Validators.required]),
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
