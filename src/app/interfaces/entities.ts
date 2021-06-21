export interface Patient {
  userUid?: string;
  firstName: string;
  lastName: string;
  age: number;
  dni: number;
  email: string;
  photo?: string;
  photo2?: string;
  medicalAssistance: string;
  role: string;
  active: boolean; // true
}

export interface Specialist {
  userUid?: string;
  firstName: string;
  lastName: string;
  age: number;
  dni: number;
  email: string;
  photo?: string;
  specialties: string[];
  role: string;
  active: boolean; // false (necesita validación de un admin)
}

export interface Admin {
  userUid?: string;
  firstName: string;
  lastName: string;
  age: number;
  dni: number;
  email: string;
  photo?: string;
  role: string;
  active: boolean; // true
}
