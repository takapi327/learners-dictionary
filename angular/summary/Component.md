# Component

## 目次
- [複数コンポーネントの連携]()
  - [コンポーネントを入れ子に配置]()
  - [ライフサイクルメソッド]()
    - [ngOnInit/ngOnDestriy]()
    - [ngOnChanges]()
    - [ngAfterViewInit/ngAfterViewChecked]()
    - [ng-content]()
    - [ngAfterContentInit/ngAfterContentChecked]()
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
Outputデコレーターは親から子に値を渡すのに対して、子から親に値を受け渡す処理を行います。
Outputデコレーターを使い先ほど一覧表示したuser情報を編集していきます。
まず編集用のコンポーネントを作成してフォームを作っていきます。
```html
<form #myForm="ngForm" (ngSubmit)="onsubmit()" *ngIf="user">
  <div>
    <label for="id">ID:</label>
    <span id="id">{{user.id}}</span>
  </div>

  <div>
    <label for="name">名前:</label>
    <input id="name" name="name" size="8" type="text" [(ngModel)]="user.name" />
  </div>

  <div>
    <label for="gender">性別:</label>
    <input id="gender" name="gender" size="1" type="text" [(ngModel)]="user.gender" />
  </div>

  <div>
    <label for="age">年齢:</label>
    <input id="age" name="age" size="3" type="text" [(ngModel)]="user.age" />
  </div>

  <div>
    <input type="submit" value="編集" /> 
  </div>
</form>
```
フォーム作成の際にuser情報が渡された時のみ表示させる処理、イベントバインディングを使いonsubmitと紐付けを行っています。
コンポーネントでInputデコレーターでuser情報を受け取り、OutputデコレーターでeditedにUser型を渡すイベントを作成している。
onsubmitイベントが発生したときにuser情報を渡す処理を行う。
```js
export class UserEditComponent implements OnInit {

  @Input() user: User;
  @Output() edited = new EventEmitter<User>();

  onsubmit() {
    this.edited.emit(this.user);
  }
}
```
親コンポーネントも子コンポーネントで発生したイベント(Outputデコレーター)を受け取れるように修正します。
```html
<div>
  <span *ngFor="let u of users">
    [<a href="#" (click)="onclick(u)">{{u.name}}</a>]
  </span>
  <app-user-edit [user]="selected" (edited)="onedited($event)"></app-user-edit>
</div>
```
イベントバインディングを追加しイベント情報(子で編集したuser情報)を受け取る。
```js
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
```
コンポーネントで受け取ったイベント(user情報)と選択しているuser情報を比較しidが同じであれば受け取ったuser情報を代入し上書きしている。下記画像のように編集することができるようになる。

<img width="403" alt="スクリーンショット 2020-07-06 23 35 15" src="https://user-images.githubusercontent.com/57429437/86605208-5a321580-bfe1-11ea-8687-65b5480d8ac9.png">

### [ライフサイクルメソッド](https://angular.jp/guide/lifecycle-hooks#hooking-into-the-component-lifecycle)
#### ngOnInit/ngOnDestriy
#### ngOnChanges
#### ngAfterViewInit/ngAfterViewChecked
#### ng-content
#### ngAfterContentInit/ngAfterContentChecked

## 参考文献
[[Angular] ライフサイクルメソッドをみる(ngOnChanges と ngOnInit と ngOnDestroy)](https://qiita.com/ksh-fthr/items/ccd9861f919c4aa30ae8)<br>
[[Angular] ライフサイクルメソッドをみる(ngDoCheck)](https://qiita.com/ksh-fthr/items/f1adea56c17f8c7f6c0d)<br>
[[Angular] ライフサイクルメソッドをみる(ngAfterContentInit と ngAfterContentChecked)](https://qiita.com/ksh-fthr/items/bf8fb8c66cd1d044866e)<br>
[[Angular] ライフサイクルメソッドをみる(ngAfterViewInit と ngAfterViewChecked)](https://qiita.com/ksh-fthr/items/411d2884875a4a0f7bd6)<br>
