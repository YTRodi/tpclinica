import { Patient, Specialist } from './entities';

export interface Shift {
  uid?: string;
  day: Date | string;
  specialty: string;
  status: string;
  specialist?: Specialist;
  patient?: Patient;
}
