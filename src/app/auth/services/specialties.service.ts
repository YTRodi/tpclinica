import { Injectable } from '@angular/core';
import {
  AngularFirestoreCollection,
  AngularFirestore,
} from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { SpecialtyI } from '../interfaces/specialty';

@Injectable({
  providedIn: 'root',
})
export class SpecialtiesService {
  private specialtiesCollection: AngularFirestoreCollection<any>;
  private nameCollectionDB = 'specialties';

  constructor(private afs: AngularFirestore) {
    this.specialtiesCollection = afs.collection<SpecialtyI[]>(
      this.nameCollectionDB
    );
  }

  public getAllSpecialties(): Observable<SpecialtyI[]> {
    return this.afs
      .collection(this.nameCollectionDB)
      .snapshotChanges()
      .pipe(
        map((actions) =>
          actions.map((a) => {
            const data = a.payload.doc.data() as SpecialtyI;
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
