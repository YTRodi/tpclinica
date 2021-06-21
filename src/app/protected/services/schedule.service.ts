import { Injectable } from '@angular/core';
import {
  AngularFirestoreCollection,
  AngularFirestore,
  AngularFirestoreDocument,
} from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class ScheduleService {
  private schedulesCollection: AngularFirestoreCollection<any>;
  private nameCollectionDB = 'schedules';
  public itemDoc: AngularFirestoreDocument<any> | null = null;

  constructor(private afs: AngularFirestore) {
    this.schedulesCollection = afs.collection<any[]>(this.nameCollectionDB);
  }

  public getAllSchedules(): Observable<any[]> {
    return this.afs
      .collection(this.nameCollectionDB)
      .snapshotChanges()
      .pipe(
        map((actions) =>
          actions.map((a) => {
            const data = a.payload.doc.data() as object;
            const id = a.payload.doc.id;

            return { id, ...data };
          })
        )
      );
  }

  public async getScheduleByEmail(email: string) {
    return this.afs
      .collection(this.nameCollectionDB, (ref) =>
        ref.where('user.email', '==', email)
      )
      .snapshotChanges()
      .pipe(
        map((actions: any) =>
          actions.map((a: any) => {
            const data = a.payload.doc.data() as object;
            const uid = a.payload.doc.id;

            return { uid, ...data };
          })
        )
      );
  }

  public addSchedule(schedule: object) {
    return this.schedulesCollection.add(schedule);
  }

  public async updateData(schedule: any) {
    this.itemDoc = this.afs.doc(`schedules/${schedule.uid}`);
    this.itemDoc.update(schedule);
  }
}
