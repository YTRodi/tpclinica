import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';
import { Specialty } from 'src/app/auth/interfaces/specialty';
import { SpecialtiesService } from 'src/app/auth/services/specialties.service';
import { Roles } from 'src/app/constants/roles';
import { Patient, Specialist, Admin } from 'src/app/interfaces/entities';

@Component({
  selector: 'app-specialty-finder',
  templateUrl: './specialty-finder.component.html',
  styleUrls: ['./specialty-finder.component.css'],
})
export class SpecialtyFinderComponent implements OnInit, OnChanges {
  @Input() showAddItem: boolean = false;
  @Input() specialtiesByCurrentUser: Patient | Specialist | Admin | null = null;
  @Output() onSelectSpecialty: EventEmitter<Specialty | null>;

  public specialtiesList: Array<Specialty>;

  public copyList: any;
  public searchString: string;
  public selectedSpecialty: any;
  public eneableAddNewSpecialty: boolean = false;

  constructor(private specialtiesService: SpecialtiesService) {
    this.searchString = '';
    this.specialtiesList = [];
    this.onSelectSpecialty = new EventEmitter<Specialty | null>();
  }

  ngOnInit(): void {}

  ngOnChanges(changes: SimpleChanges): void {
    if (
      changes.specialtiesByCurrentUser &&
      changes.specialtiesByCurrentUser.currentValue &&
      changes.specialtiesByCurrentUser.currentValue.role === Roles.SPECIALIST
    ) {
      this.specialtiesList =
        changes.specialtiesByCurrentUser.currentValue.specialties;
      this.copyList = changes.specialtiesByCurrentUser.currentValue.specialties;
      return;
    }

    this.specialtiesService.getAllSpecialties().subscribe((data) => {
      this.specialtiesList = data;
      this.copyList = data;
    });
  }

  // Output
  selectSpecialty(item: Specialty) {
    if (this.selectedSpecialty && this.selectedSpecialty.id === item.id) {
      this.onSelectSpecialty.emit(null);
      this.selectedSpecialty = null;
    } else {
      this.onSelectSpecialty.emit(item);
      this.selectedSpecialty = item;
    }
  }

  addSpecialty() {
    this.specialtiesService.addSpecialty({ name: this.searchString });
    this.eneableAddNewSpecialty = false;
    this.searchString = '';
  }

  filterByInputValue() {
    this.copyList = this.specialtiesList;

    if (this.copyList) {
      const filteredList = this.copyList.filter((specialty: Specialty) => {
        return specialty.name
          .toLowerCase()
          .includes(this.searchString.toLowerCase());
      });

      this.copyList = filteredList;
    }
  }
}
