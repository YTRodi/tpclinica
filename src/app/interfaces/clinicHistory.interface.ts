import { Patient, Specialist } from './entities';
import { Shift } from './shift.interface';

export interface ClinicHistory {
  id?: string;
  patient?: Patient;
  shifts?: Shift[];
}
