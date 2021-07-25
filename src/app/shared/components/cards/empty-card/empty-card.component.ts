import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-empty-card',
  templateUrl: './empty-card.component.html',
  styleUrls: ['./empty-card.component.css'],
})
export class EmptyCardComponent implements OnInit {
  @Input() text: string = 'Está vacío';
  @Input() icon: 'DEFAULT' | 'USER' = 'DEFAULT';

  constructor() {}

  ngOnInit(): void {}
}
