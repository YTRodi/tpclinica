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
  completedAt?: string | Date;
  diagnosis?: string;
  patientData?: {
    height: number;
    weight: number;
    temperature: number;
    pressure: {
      pressureSystolic: number;
      pressureDiastolic: number;
    };
  };
}
