import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-finder',
  templateUrl: './finder.component.html',
  styleUrls: ['./finder.component.css'],
})
export class FinderComponent implements OnInit {
  @Input() data: any;
  @Input() searchKeyword: any; // palabra por la que quiero que busque
  @Input() formControlName: any;
  @Input() placeholder: any;

  constructor() {}

  ngOnInit(): void {}
}
