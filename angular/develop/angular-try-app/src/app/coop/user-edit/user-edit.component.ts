import { Component, EventEmitter, Input, Output, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { User } from '../user';

@Component({
  selector: 'app-user-edit',
  templateUrl: './user-edit.component.html',
  styleUrls: ['./user-edit.component.scss']
})
export class UserEditComponent implements OnInit, OnChanges {

  @Input() user: User;
  @Output() edited = new EventEmitter<User>();

  onsubmit() {
    this.edited.emit(this.user);
  }

  ngOnChanges(changes: SimpleChanges) {
    console.log('[user-edit] ngOnChanges');
    for(let prop in changes) {
      let change = changes[prop];
      console.log(`${prop}:${change.previousValue} => ${change.currentValue}`);
    }
  }

  constructor() { }

  ngOnInit(): void {
  }

}
