export interface Patient {
  uid?: string;
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
  uid?: string;
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
  uid?: string;
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
