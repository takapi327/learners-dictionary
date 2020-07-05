import { Component, OnInit } from '@angular/core';
import { User } from '../user';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss']
})
export class UserComponent implements OnInit {

  selected: User;
  
  users = [
    {
      id: 1,
      name: "YAMADA",
      gemder: "男",
      age: 20
    },
    {
      id: 2,
      name: "TAKEDA",
      gemder: "女",
      age: 25
    },
    {
      id: 3,
      name: "SATOU",
      gemder: "男",
      age: 30
    },
    {
      id: 4,
      name: "ISIDA",
      gemder: "女",
      age: 22
    },
    {
      id: 5,
      name: "SUZUKI",
      gemder: "男",
      age: 26
    }
  ];

  onclick(user: User){
    this.selected = user;
  }

  constructor() { }

  ngOnInit(): void {
  }

}
