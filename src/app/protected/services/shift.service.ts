import { Injectable } from '@angular/core';
import {
  AngularFirestoreCollection,
  AngularFirestore,
  AngularFirestoreDocument,
} from '@angular/fire/firestore';
import { addDays, getDay, set } from 'date-fns';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ShiftStatus } from 'src/app/constants/shifts';
import { parsedSelectedDatesInForm } from 'src/app/helpers/shift';
import { Shift } from 'src/app/interfaces/shift.interface';

@Injectable({
  providedIn: 'root',
})
export class ShiftService {
  private shiftsCollection: AngularFirestoreCollection<any>;
  private nameCollectionDB = 'shifts';
  public itemDoc: AngularFirestoreDocument<any> | null = null;

  constructor(private afs: AngularFirestore) {
    this.shiftsCollection = afs.collection<any[]>(this.nameCollectionDB);
  }

  public getAllShifts(): Observable<any[]> {
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

  public generateShiftsByArray(
    weekDays: any,
    formFields: any,
    specialist: any
  ) {
    const { specialty, days, from, to, duration } = formFields;

    const selectedDays = parsedSelectedDatesInForm(weekDays, days);
    const now = new Date();

    for (let index = 0; index < 29; index++) {
      const updatedDateNow = addDays(now, index);

      for (const day of selectedDays) {
        if (getDay(updatedDateNow) === day.id) {
          for (let index2 = from; index2 <= to; index2++) {
            const result = set(updatedDateNow, {
              hours: index2,
              minutes: 0,
              seconds: 0,
            });

            const newShift: Shift = {
              day: result.toString(),
              specialty: specialty,
              status: ShiftStatus.AVAILABLE,
              specialist,
            };

            this.addShift(newShift);

            if (index2 < to && duration === 30) {
              const updatedResult = set(result, { minutes: 30 });

              const newShiftWith30MoreMinutes: Shift = {
                ...newShift,
                day: updatedResult,
              };

              this.addShift(newShiftWith30MoreMinutes);
            }
          }
        }
      }
    }
  }

  public addShift(shift: Shift) {
    return this.shiftsCollection.add(shift);
  }

  public async updateShiftData(shift: Shift) {
    this.itemDoc = this.afs.doc(`shifts/${shift.uid}`);
    this.itemDoc.update(shift);
  }
}
