import { Component, OnInit } from '@angular/core';
import { User } from '../user';

@Component({
  selector: 'app-try-angular',
  templateUrl: './try-angular.component.html',
  styleUrls: ['./try-angular.component.scss']
})
export class TryAngularComponent implements OnInit {

  show = false;

  season = '';

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
  
  onclick() {
    this.users = [
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
      },
      {
        id: 6,
        name: "NAKAYAMA",
        gemder: "女",
        age: 18
      }
    ];
  }

  trackFn(index: any, user: any){
    return user.id;
  }

  style = {
    backgroundColor: '#f00',
    color:           '#fff',
    fontWeight:      'bold'
  };

  temp = 0;

  onclick(user: User){
    this.selected = user;
  }

  constructor() { }

  ngOnInit(): void {
  }

}
