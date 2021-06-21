import { Injectable } from '@angular/core';
import {
  AngularFirestoreCollection,
  AngularFirestore,
} from '@angular/fire/firestore';
import { BehaviorSubject, Observable } from 'rxjs';
import { first, map, switchMap, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class ScheduleService {
  private schedulesCollection: AngularFirestoreCollection<any>;
  private nameCollectionDB = 'schedules';

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

  public getScheduleByEmail(email: string) {
    const email$: BehaviorSubject<string> = new BehaviorSubject(email);

    return email$.pipe(
      switchMap((email) =>
        this.afs
          .collection(this.nameCollectionDB, (ref) =>
            ref.where('emailSpecialist', '==', email)
          )
          .valueChanges()
      )
    );
  }

  public addSchedule(schedule: object) {
    return this.schedulesCollection.add(schedule);
  }
}
