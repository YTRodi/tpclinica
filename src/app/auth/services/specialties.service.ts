import { Injectable } from '@angular/core';
import {
  AngularFirestoreCollection,
  AngularFirestore,
} from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Specialty } from '../interfaces/specialty';

@Injectable({
  providedIn: 'root',
})
export class SpecialtiesService {
  private specialtiesCollection: AngularFirestoreCollection<any>;
  private nameCollectionDB = 'specialties';

  constructor(private afs: AngularFirestore) {
    this.specialtiesCollection = afs.collection<Specialty[]>(
      this.nameCollectionDB
    );
  }

  public getAllSpecialties(): Observable<Specialty[]> {
    return this.afs
      .collection(this.nameCollectionDB, (ref) => ref.orderBy('name', 'asc'))
      .snapshotChanges()
      .pipe(
        map((actions) =>
          actions.map((a) => {
            const data = a.payload.doc.data() as Specialty;
            const id = a.payload.doc.id;

            return { id, ...data };
          })
        )
      );
  }

  public addSpecialty(specialty: object) {
    return this.specialtiesCollection.add(specialty);
  }
}
