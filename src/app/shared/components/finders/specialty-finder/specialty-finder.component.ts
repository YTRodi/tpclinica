import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { SpecialtyI } from 'src/app/auth/interfaces/specialty';
import { SpecialtiesService } from 'src/app/auth/services/specialties.service';

@Component({
  selector: 'app-specialty-finder',
  templateUrl: './specialty-finder.component.html',
  styleUrls: ['./specialty-finder.component.css'],
})
export class SpecialtyFinderComponent implements OnInit {
  @Input() showAddItem: boolean = false;
  @Output() onSelectSpecialty: EventEmitter<SpecialtyI | null>;

  public specialtiesList: Array<SpecialtyI>;

  public copyList: any;
  public searchString: string;
  public selectedSpecialty: any;
  public eneableAddNewSpecialty: boolean = false;

  constructor(private specialtiesService: SpecialtiesService) {
    this.searchString = '';
    this.specialtiesList = [];
    this.onSelectSpecialty = new EventEmitter<SpecialtyI | null>();
  }

  ngOnInit(): void {
    this.specialtiesService.getAllSpecialties().subscribe((data) => {
      this.specialtiesList = data;
      this.copyList = data;
    });
  }

  // Output
  selectSpecialty(item: SpecialtyI) {
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
      const filteredList = this.copyList.filter((specialty: SpecialtyI) => {
        return specialty.name
          .toLowerCase()
          .includes(this.searchString.toLowerCase());
      });

      this.copyList = filteredList;
    }
  }
}
