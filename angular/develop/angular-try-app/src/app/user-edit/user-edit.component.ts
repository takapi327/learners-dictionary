import { Component, EventEmitter, Input, Output, OnInit } from '@angular/core';
import { User } from '../user';

@Component({
  selector: 'app-user-edit',
  templateUrl: './user-edit.component.html',
  styleUrls: ['./user-edit.component.scss']
})
export class UserEditComponent implements OnInit {

  @Input() user: User;
  @Output() edited = new EventEmitter<User>();

  onsubmit() {
    this.edited.emit(this.user);
  }

  constructor() { }

  ngOnInit(): void {
  }

}
