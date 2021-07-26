import { Patient, Specialist } from './entities';

export interface Shift {
  id?: string;
  day: string;
  specialty: string;
  status: string;
  specialist?: Specialist;
  patient?: Patient;

  cancelReason?: string;
  rejectReason?: string;
  commentCompleted?: string;
}
