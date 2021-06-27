import { Component, Input, OnInit } from '@angular/core';
import { SpecialtyI } from 'src/app/auth/interfaces/specialty';
import { SpecialtiesService } from 'src/app/auth/services/specialties.service';

@Component({
  selector: 'app-search-bar',
  templateUrl: './search-bar.component.html',
  styleUrls: ['./search-bar.component.css'],
})
export class SearchBarComponent implements OnInit {
  @Input() listToSearch: any;
  @Input() showAddItem: boolean = false;
  @Input() eneableAddItem: boolean = false;
  // public eneableAddItem: boolean = false;

  public copyList: any;
  public searchString: string;
  public selectedItem: any;

  constructor(private specialtiesService: SpecialtiesService) {
    this.searchString = '';
  }

  ngOnInit(): void {
    console.log(this.listToSearch);
    this.copyList = this.listToSearch;
    // this.specialtiesService.getAllSpecialties().subscribe((data) => {
    //   // Esto hacerlo en el ngOnInit
    //   this.listToSearch = data;
    //   this.copyList = data;
    // });
  }

  selectItem(item: any) {
    this.selectedItem = item;
  }

  // Output
  addItem() {
    this.eneableAddItem = false;
    this.searchString = '';
  }

  filterByInputValue() {
    this.copyList = this.listToSearch;

    if (this.copyList) {
      const filteredList = this.copyList.filter((specialty: SpecialtyI) => {
        return specialty.name.toLowerCase().includes(this.searchString);
      });

      console.log(`filteredList`, filteredList);
      this.listToSearch = filteredList;
    }
  }
}
