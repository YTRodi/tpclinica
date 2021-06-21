import { Injectable } from '@angular/core';
import {
  AngularFirestoreCollection,
  AngularFirestore,
  AngularFirestoreDocument,
} from '@angular/fire/firestore';
import { AngularFireStorage } from '@angular/fire/storage';
import { Observable } from 'rxjs';
import { finalize, first, map, tap } from 'rxjs/operators';
// import { Specialist, Admin } from 'src/app/classes/entities';
import { FolderImages } from 'src/app/constants/images';
import { Roles } from 'src/app/constants/roles';
import { Patient, Specialist, Admin } from 'src/app/interfaces/entities';
import { FileI } from '../interfaces/fileI';
import { v4 } from 'uuid';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private usersCollection: AngularFirestoreCollection<any>;
  private nameCollectionDB = 'users';
  public itemDoc: AngularFirestoreDocument<
    Patient | Specialist | Admin
  > | null = null;
  private filePath: any;
  private urlImages: Array<any> = [];

  constructor(
    private afs: AngularFirestore,
    private storage: AngularFireStorage
  ) {
    this.usersCollection = afs.collection<any>(this.nameCollectionDB);
  }

  public getAllUsers(): Observable<any[]> {
    return this.afs
      .collection(this.nameCollectionDB)
      .snapshotChanges()
      .pipe(
        map((actions) =>
          actions.map((a) => {
            const data = a.payload.doc.data() as object;
            const uid = a.payload.doc.id;

            return { uid, ...data };
          })
        )
      );
  }

  public async getUserByEmail(email: string | null | undefined) {
    return this.afs
      .collection<any>(this.nameCollectionDB, (ref) =>
        ref.where('email', '==', email)
      )
      .valueChanges()
      .pipe(
        tap((data) => data),
        first()
      )
      .toPromise();
  }

  public async updateData(user: any) {
    this.itemDoc = this.afs.doc(`users/${user.uid}`);
    this.itemDoc.update(user);
  }

  public preAddAndUploadImage(
    user: Patient | Specialist | Admin,
    folder: FolderImages,
    images: FileI[]
  ): void {
    this.uploadImage(user, folder, images);
  }

  public addUser(user: Patient | Specialist | Admin) {
    switch (user.role) {
      case Roles.PATIENT:
        this.usersCollection.add({
          ...user,
          photo: this.urlImages[0],
          photo2: this.urlImages[1],
          createdAt: new Date(),
        });
        break;

      case Roles.SPECIALIST:
        this.usersCollection.add({
          ...user,
          photo: this.urlImages[0],
          createdAt: new Date(),
        });
        break;

      case Roles.ADMIN:
        this.usersCollection.add({
          ...user,
          photo: this.urlImages[0],
          createdAt: new Date(),
        });
        break;
    }
  }

  private async uploadImage(
    user: Patient | Specialist | Admin,
    folder: FolderImages,
    images: FileI[]
  ) {
    if (images.length === 2) {
      let flag = 0;
      for (const file of images) {
        this.filePath = `${folder}/${v4()}${file.name}`;
        const fileRef = this.storage.ref(this.filePath);
        const task = this.storage.upload(this.filePath, file);

        task
          .snapshotChanges()
          .pipe(
            finalize(() => {
              fileRef.getDownloadURL().subscribe((urlImage) => {
                this.urlImages = [...this.urlImages, urlImage].reverse();
                flag++;

                if (flag === 2) {
                  this.addUser(user);
                }
              });
            })
          )
          .toPromise();
      }

      return;
    }

    this.filePath = `${folder}/${v4()}${images[0].name}`;
    const fileRef = this.storage.ref(this.filePath);
    const task = this.storage.upload(this.filePath, images[0]);
    task
      .snapshotChanges()
      .pipe(
        finalize(() => {
          fileRef.getDownloadURL().subscribe((urlImage) => {
            this.urlImages = [...this.urlImages, urlImage].reverse();
            this.addUser(user);
          });
        })
      )
      .subscribe();
  }
}
