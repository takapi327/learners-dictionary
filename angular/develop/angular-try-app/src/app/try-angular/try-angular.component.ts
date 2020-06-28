import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-try-angular',
  templateUrl: './try-angular.component.html',
  styleUrls: ['./try-angular.component.scss']
})
export class TryAngularComponent implements OnInit {

  show = false;

  constructor() { }

  ngOnInit(): void {
  }

}
