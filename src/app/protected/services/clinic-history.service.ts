import { Injectable } from '@angular/core';
import {
  AngularFirestoreCollection,
  AngularFirestoreDocument,
  AngularFirestore,
} from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ClinicHistory } from 'src/app/interfaces/clinicHistory.interface';

@Injectable({
  providedIn: 'root',
})
export class ClinicHistoryService {
  public clinicHistoryCollection: AngularFirestoreCollection<any>;
  private nameCollectionDB = 'clinicHistory';
  public itemDoc: AngularFirestoreDocument<any> | null = null;

  constructor(private afs: AngularFirestore) {
    this.clinicHistoryCollection = afs.collection<any[]>(this.nameCollectionDB);
  }

  public getAllClinicHistories(): Observable<ClinicHistory[]> {
    return this.afs
      .collection(this.nameCollectionDB)
      .snapshotChanges()
      .pipe(
        map((actions) =>
          actions.map((a) => {
            const data = a.payload.doc.data() as ClinicHistory;
            const id = a.payload.doc.id;

            return { id, ...data };
          })
        )
      );
  }

  // public async getClinicHistoriesByPatientEmail(
  //   patientEmail: string
  // ): Promise<Observable<ClinicHistory[]>> {

  public async getClinicHistoriesByPatientEmail(patientEmail: string) {
    return this.afs
      .collection(this.nameCollectionDB, (ref) =>
        ref.where('patient.email', '==', patientEmail)
      )
      .snapshotChanges()
      .pipe(
        map((actions: any) =>
          actions.map((a: any) => {
            const data = a.payload.doc.data() as ClinicHistory;
            const id = a.payload.doc.id;

            return { id, ...data };
          })
        )
      );
  }

  public addClinicHistory(clinicHistory: ClinicHistory) {
    return this.clinicHistoryCollection.add(clinicHistory);
  }
}
