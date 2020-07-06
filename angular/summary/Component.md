# Component

## 目次
- [複数コンポーネントの連携]()
  - [コンポーネントを入れ子に配置]()
- [参考文献]()

## 複数コンポーネントの連携
### コンポーネントを入れ子に配置
#### [@Inputデコレーター](https://angular.jp/guide/template-syntax#input-%E3%81%A8-output-%E3%83%97%E3%83%AD%E3%83%91%E3%83%86%E3%82%A3)
@Inputデコレーターは、親コンポーネントから子コンポーネントに対して値を引き渡すためのものです。
今回は親コンポーネントでUserを一覧表示し、子コンポーネントで親コンポーネントで選択したUserを編集する機能を実装してみます。
```html
<div>
  <span *ngFor="let u of users">
    [<a href="#" (click)="onclick(u)">{{u.name}}</a>]
  </span>
  <app-user-detail [user]="selected"></app-user-detail>
</div>  
```
まずUserの一覧表示を行うためにngForを使用しコンポーネントから受け取ったusersを一覧表示させる。
クリックイベントを設定し、イベントが動作したときに該当のuser情報をコンポーネントに送る。
```js
export class UserComponent implements OnInit {

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

}
```

コンポーネント側でイベントバインディングで受け取ったuser情報を予め定義しておいたselectedに渡してあげる。
selectedはUserという型を定義してる。user情報を受け取れるように予め下記のようにUserクラスを作成し、インポートしておく必要がある。
```js
export class User {
  id:     number;
  name:   String;
  gender: String;
  age:    number;
}
```
ここでselectedに渡したuser情報を` <app-user-detail [user]="selected"></app-user-detail>`の部分で子コンポーネントに渡してあげる。
子コンポーネント側で@Inputデコレーターを使用し親コンポーネントから子コンポーネントに値を引き渡す処理が完了する。
```js
export class UserDetailComponent implements OnInit {

  @Input() user: User;

  constructor() { }

  ngOnInit(): void {
  }

}
```

あとは下記のようにuser情報が渡されたら(選択イベントが発生したら)そのuser情報を一覧表示している。
```html
<ul *ngIf="user">
  <li>{{user.id}}</li>
  <li>{{user.name}}</li>
  <li>{{user.gender}}</li>
  <li>{{user.age}}</li>
</ul>
```
下記画像のように選択したuserの情報が表示される。

<img width="390" alt="スクリーンショット 2020-07-06 22 58 17" src="https://user-images.githubusercontent.com/57429437/86601374-302a2480-bfdc-11ea-9287-3a991162b3de.png">
---
<img width="393" alt="スクリーンショット 2020-07-06 22 58 40" src="https://user-images.githubusercontent.com/57429437/86601419-3e784080-bfdc-11ea-8ce4-dd0904206509.png">

### [@Outputデコレーター](https://angular.jp/guide/template-syntax#input-%E3%81%A8-output-%E3%83%97%E3%83%AD%E3%83%91%E3%83%86%E3%82%A3)

## 参考文献
