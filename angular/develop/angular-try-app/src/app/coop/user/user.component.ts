import { Component, OnInit, OnChanges } from '@angular/core';
import { User } from '../user';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss']
})
export class UserComponent implements OnInit, OnChanges {

  selected: User;
  
  users = [
    {
      id: 1,
      name: "YAMADA",
      gender: "男",
      age: 20
    },
    {
      id: 2,
      name: "TAKEDA",
      gender: "女",
      age: 25
    },
    {
      id: 3,
      name: "SATOU",
      gender: "男",
      age: 30
    },
    {
      id: 4,
      name: "ISIDA",
      gender: "女",
      age: 22
    },
    {
      id: 5,
      name: "SUZUKI",
      gender: "男",
      age: 26
    }
  ];

  onclick(user: User){
    this.selected = user;
  }

  onedited(user: User) {
    for(let u of this.users){
      if(u.id === user.id){
        u.name   = user.name;
        u.gender = user.gender;
        u.age    = user.age;
      }
    }
    this.selected = null;
  }

  constructor() { }

  ngOnChanges() {
    console.log('ngOnChanges');
  };

  ngOnInit(): void {
  }

}
