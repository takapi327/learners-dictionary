import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-try-angular',
  templateUrl: './try-angular.component.html',
  styleUrls: ['./try-angular.component.scss']
})
export class TryAngularComponent implements OnInit {

  show = false;

  season = '';

  users = [
    {
      id: 1,
      name: "YAMADA"
    },
    {
      id: 2,
      name: "TAKEDA"
    },
    {
      id: 3,
      name: "SATOU"
    },
    {
      id: 4,
      name: "ISIDA"
    },
    {
      id: 5,
      name: "SUZUKI"
    }
  ];
  
  onclick() {
    this.users = [
      {
        id: 1,
        name: "YAMADA"
      },
      {
        id: 2,
        name: "TAKEDA"
      },
      {
        id: 3,
        name: "SATOU"
      },
      {
        id: 4,
        name: "ISIDA"
      },
      {
        id: 5,
        name: "SUZUKI"
      },
      {
        id: 6,
        name: "NAKAYAMA"
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

  constructor() { }

  ngOnInit(): void {
  }

}
