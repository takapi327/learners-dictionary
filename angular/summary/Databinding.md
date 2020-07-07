# Databinding

## 目次
- [データバインディング]()
  - [Interpolation(補間)]()
  - [プロパティバインディング]()
  - [属性/クラス/スタイルバインディング]()
  - [イベントバインディング]()
    - [preventDefault]()
    - [stopPropagation]()
    - [テンプレート参照変数]()
  - [双方向バインディング]()

## [データバインディング](https://angular.jp/guide/template-syntax#%E3%83%90%E3%82%A4%E3%83%B3%E3%83%87%E3%82%A3%E3%83%B3%E3%82%B0%E6%A7%8B%E6%96%87-%E6%A6%82%E8%A6%81)
データバインディングは、コンポーネントにおいてテンプレートとクラス内の要素を繋ぐ仕組みみたいです。
調べたところコンポーネントというのは、画面の一部分であるビュー (View) を制御するもので、
`@Component` 修飾子のついたメタデータをもつ `TypeScript` クラスのことを指し、下記のように実装されます。(Angularのquickstart参照)
```js
/* augular本体からComponentをインストール */
import { Component } from '@angular/core'

@Component({
  selector: 'my-app',  // HTMLで表示したい場所を指定
  templete: `<h1>Hello {{name}}</h1>`,  // 表示したいビューを定義
})

/* exportすることでComponent内で使用可能にする */
export class AppComponent {
  name = 'Angular';  // nameに値を代入
}
```
コメントの通り上記＠Component内では、ビューの一部を作成しどこのHTMLに埋め込むかを決めており、今回は`my-app`という下記のような中に`templete`の値が入ることになる。
```html
  <body>
    <my-app></my-app>
  </body>
```
同クラス内のメンバー(nameの箇所)で`name = 'Angular'`を定義しており、`@Component`内で使用している。
こちらexportを外すとname値を使うことができなくなり、ビューを表示することもできなくなる。
### [Interpolation(補間)](https://angular.jp/guide/template-syntax#%E8%A3%9C%E9%96%93%E3%81%A8%E3%83%86%E3%83%B3%E3%83%97%E3%83%AC%E3%83%BC%E3%83%88%E5%BC%8F)
上記でクラスのメンバーを表示していた箇所で`{{name}}`の用に定義されていましたが、これが１つ目のデータバインディングである`Interpolation`です。
クラスで定義された値を{{...}}で参照するという方法でデータを紐づけています。
{{...}}で表示できないものさせてはいけないものもあるようで、「代入演算子、new 演算子」などがこれに当たります。

### [プロパティバインディング](https://angular.jp/guide/template-syntax#%E3%83%97%E3%83%AD%E3%83%91%E3%83%86%E3%82%A3%E3%83%90%E3%82%A4%E3%83%B3%E3%83%87%E3%82%A3%E3%83%B3%E3%82%B0-property)
プロパティバインディングは、値をコンポーネントのプロパティ(オブジェクトの持つ設定や状態、属性などの情報)から 対象の要素のプロパティへとデータを紐付ける動きをします。
先ほどの記述に追加して見ます。
```js
import { Component } from '@angular/core'

@Component({
  selector: 'my-app', 
  templete: `<h1>Hello {{name}}</h1>
             <img [src]="image"/>
            `, 
})

export class AppComponent {
  name  = 'Angular'; 
  image = 'hogehoge.jpg'; // 画像データを定義
}
```
やっていることは先ほどの`Interpolation`と同じです。実際に`<img src="{{image}}"/>`と定義して画像を表示させることも可能です。
では何が違うのか公式ドキュメントには下記のように書かれています。
>多くの場合、補間はプロパティバインディングよりも簡単な手段です。 データの値を文字列として表示するときは、 技術的にはどちらでもよく、読みやすさは補間に分があります。 しかし 要素のプロパティに文字列以外の値を設定する場合は、 プロパティバインディングを使う必要があります。

上記で`文字列以外の値`としていますので、実際に文字列以外を表示させてみます。
```js
import { Component } from '@angular/core'

@Component({
  selector: 'my-app', 
  templete: `<div>{{html}}</div>`, 
})

export class AppComponent {
  html = `<script>hogehoge</script>
          <div>fogefoge</div>
          <input type="button" value="入力"/>
          <button>押すなよ</button>
         `; // HTMLデータを定義
}
```
上記を`Interpolation`で定義して見ましたが、表示されるのは渡した値がそのまま文字列として表示されてしまいます。

<img width="733" alt="スクリーンショット 2020-06-18 0 57 19" src="https://user-images.githubusercontent.com/57429437/84920838-ab479b80-b0fe-11ea-98a4-fa7742217b10.png">

この問題をプロパティバインディングであれば解決することができます。
```js
import { Component } from '@angular/core'

@Component({
  selector: 'my-app', 
  templete: `<div [innerHTML]="html"></div>`, 
})

export class AppComponent {
  html = `<script>hogehoge</script>
          <div>fogefoge</div>
          <input type="button" value="入力"/>
          <button>押すなよ</button>
         `; // HTMLデータを定義
}
```
変更されたのは`<div>[innerHTML]="html"</div>`の部分のみですが、`innerHTML`はアプリ側で組み立てた文字列をHTMLとして反映させることができるのです。
ただこれでも上記はうまく表示させることができません。

<img width="119" alt="スクリーンショット 2020-06-18 1 03 33" src="https://user-images.githubusercontent.com/57429437/84921517-899ae400-b0ff-11ea-99ab-50c2a44c3f98.png">

<img width="263" alt="スクリーンショット 2020-06-18 7 39 58" src="https://user-images.githubusercontent.com/57429437/84957783-eb2a7500-b136-11ea-8e2f-d0dc8d14f3e8.png">

上記を見てわかる通り、定義していた`<script>,<input>,<button>`が削除されてしまっています。これはプロパティバインディングがセキュリティを危険に晒す可能性のあるものを防ごうとしているからです。
ただアプリ側(自身)で作成した物であれば、外部から注入された物よりも信頼性があり問題ないと把握しているはずです。なので先ほどのコンポーネントの値に信頼済マークを貼るという作業を行って正常に表示されるように設定していきます。
```js
import { Component } from '@angular/core'
import { DomSanitizer, SafeHtml } from '@angular/platform-browser'

@Component({
  selector: 'my-app', 
  templete: `<div [innerHTML]="safeMsg"></div>`, 
})

export class AppComponent {
  safeMsg: SafeHtml;
  html = `<script>hogehoge</script>
          <div>fogefoge</div>
          <input type="button" value="クリック"/>
          <button>押すなよ</button>
         `; // HTMLデータを定義
  constructor(private sanitizer: DomSanitizer) {
    this.safeMsg = sanitizer.bypassSecurityTrustHtml(this.html);
  }
}
```
新たに[DomSanitizer](https://github.com/angular/angular/blob/master/packages/platform-browser/src/security/dom_sanitization_service.ts#L90)と[SafeHtml](https://github.com/angular/angular/blob/master/packages/platform-browser/src/security/dom_sanitization_service.ts#L28)を追加しています。
[bypassSecurityTrustHtml](https://github.com/angular/angular/blob/master/packages/platform-browser/src/security/dom_sanitization_service.ts#L109)は`DomSanitizer`に含まれるメソッドであり、String型を引数にとりSafeHtml型に変換している。
これによって表示されていなかった物が正常に表示されるようになっている。

<img width="443" alt="スクリーンショット 2020-06-19 8 16 16" src="https://user-images.githubusercontent.com/57429437/85080832-285d3880-b205-11ea-844c-056ff82ee186.png">

## [属性/クラス/スタイルバインディング](https://angular.jp/guide/template-syntax#%E5%B1%9E%E6%80%A7%E3%80%81%E3%82%AF%E3%83%A9%E3%82%B9%E3%80%81%E3%82%B9%E3%82%BF%E3%82%A4%E3%83%AB%E3%81%AE%E3%83%90%E3%82%A4%E3%83%B3%E3%83%87%E3%82%A3%E3%83%B3%E3%82%B0)

プロパティバインディングでは使用できない場合、またプロパティバインディングよりも簡潔に
記述できるようにするための特殊な単方向バインディングが、属性/クラス/スタイルバインディングです。実際に各バインディングに関して説明していきます。

### [属性バインディング](https://angular.jp/guide/template-syntax#%E5%B1%9E%E6%80%A7%E3%83%90%E3%82%A4%E3%83%B3%E3%83%87%E3%82%A3%E3%83%B3%E3%82%B0)
属性バインディングはざっくり説明すると、要素の初期値を表します。
プロパティバインディンは現在値を表しており、HTML要素のほとんどはこの属性とプロパティ(同名)を持っていますが、中にはプロパティを持たず属性だけを持っている要素も存在します。
なので属性しか持っていない要素に対してプロパティバインディングを使ってもエラーが出てしまいます。こうした要素に対してバインディングを行えるのが`属性バインディング`なのです。
例えば表を表示する`<td>`は横のセル数を指定する`colspan`と縦のセル数をしている`rowspan`属性を持っています。この要素はプロパティを持っていません。

```js
@Component({
  selector: 'my-app'
  template: `<table border="1">
               <tr><td [rowspan]="len">結合</td><td>1</td></tr>
               <tr><td>2</td></tr>
             </table>`
})
export class AppComponent {
  len = 3;
}
```
この要素に足してプロパティバインディングを使ってもエラーが出てしまうのは先ほどの説明でわかると思います。
では属性バインディングを使って要素にバインディングをしてみましょう。

```js
@Component({
  selector: 'my-app'
  template: `<table border="1">
               <tr><td [attr.rowspan]="len">結合</td><td>1</td></tr>
               <tr><td>2</td></tr>
             </table>`
})
export class AppComponent {
  len = 3;
}
```
変更した点としては、属性名に「attr.」という接頭辞をつけたことです。これが属性バインディングの書き方で、バインディングができるようになります。
属性バインディングの主な使い道は下記属性の設定です。
```
ARIA属性
SVG属性
```
上記に関してはご自身で調べてください。

### [クラスバインディング](https://angular.jp/guide/template-syntax#%E3%82%AF%E3%83%A9%E3%82%B9%E3%83%90%E3%82%A4%E3%83%B3%E3%83%87%E3%82%A3%E3%83%B3%E3%82%B0)
クラスバインディングはその名通りHTML要素のclassに対して使用することで、プロパティバインディングよりも簡潔に実装できます。
ではどう違うのか、プロパティバインディングでもclass属性にバインディングを行うことは可能ですが、問題があります。それはバインディングして追加したクラスが既存のクラスを打ち消してしまう点です。
```js
@Component({
  selector: 'my-app',
  template: `<div class="line back" [class]="clazz"></div>`,
  styles: [`
        .line { border: solid 1px #f00; }
        .back { background-color: #0ff; }
        .fore { color: Red }
      `]
})
export class AppComponent {
  clazz = 'fore';
}
```
上記実装を行っても下記画像のような結果になります。

<img width="485" alt="スクリーンショット 2020-06-21 15 39 20" src="https://user-images.githubusercontent.com/57429437/85218450-627d3480-b3d5-11ea-9577-24612986c56a.png">

元々定義していたクラスが打ち消されてバインディングして追加したクラスのみになってしまいます。これでは新たにクラス名を追加、削除したという実装を行おうとすると既存のクラスも同様にバインディングして追加する必要が出てきてしまいます。
上記実装を簡単にクラスバインディングを使用して実装してみましょう。

```js
@Component({
  selector: 'my-app',
  template: `<div class="line back" [class.fore]="clazz"></div>`,
  styles: [`
        .line { border: solid 1px #f00; }
        .back { background-color: #0ff; }
        .fore { color: Red }
      `]
})
export class AppComponent {
  clazz = true;
}
```
変更したのはクラス名を「class.fore」としてバインディングをboolean型にした点です。
これでtrueのときはクラスを追加、falseのときは追加されないという実装を行うことができます。

<img width="485" alt="スクリーンショット 2020-06-21 15 45 40" src="https://user-images.githubusercontent.com/57429437/85218526-462dc780-b3d6-11ea-91c2-60560be97c14.png">


### [スタイルバインディング](https://angular.jp/guide/template-syntax#%E3%82%B9%E3%82%BF%E3%82%A4%E3%83%AB%E3%83%90%E3%82%A4%E3%83%B3%E3%83%87%E3%82%A3%E3%83%B3%E3%82%B0)

スタイルバインディングは、クラスバインディングと同じような記述を行いstyleに対してバインディングを行います。
先ほどの記述をスタイルバインディングに変更してみましょう。
```js

@Component({
  selector: 'my-app',
  template: `<div class="line back" [class.fore]="clazz" [style.background-color]="bcolor">クラスバインディング</div>`,
  styles: [`
        .line { border: solid 1px #f00; }
        .fore { color: Red }
      `]
})
export class AppComponent {
  clazz  = true;
  bcolor = '#0ff';
}
```
`background-color`をバインディングして実装を行いました。方法はクラスバインディングと同じように行っています。
上記を条件式によって実装を行うことも可能で各記述を下記のように変更します。
```js
[style.background-color]="bcolor ? '#0ff' : '' "

bcolor = true;
```
上記はtrueの場合設定してある左の値をfalseにした場合には右の空な値を設定しています。
スタイルプロパティには予め単位を設定して実装を行うことも可能です。
```js
[style.font-size.px]="size"

size = 150;
```
単にスタイルプロパティ名の後に実装した単位を設定し、バインディングで渡す値を数字のみにしています。どちらの実装も大差はないのですが、演算などを従う実装の場合には、単位を予め定義しておいた方がきれいに実装ができそうですね。
また実装が複雑になってくると[スタイリングの優先順位](https://angular.jp/guide/template-syntax#%E3%82%B9%E3%82%BF%E3%82%A4%E3%83%AA%E3%83%B3%E3%82%B0%E3%81%AE%E5%84%AA%E5%85%88%E9%A0%86%E4%BD%8D)も考えていく必要があるみたいです。

###  [イベントバインディング](https://angular.jp/guide/template-syntax#%E3%82%A4%E3%83%99%E3%83%B3%E3%83%88%E3%83%90%E3%82%A4%E3%83%B3%E3%83%87%E3%82%A3%E3%83%B3%E3%82%B0-event)

イベントバインディングは、ユーザーがボタンをクリックしたり、テキストボックスに文字を入力したりといった能動的な行動の結果を受けとり処理を実装をします。

#### 主なイベントの一覧
|  イベント名  |  概要  |
| ---- | ---- |
|  click  |  クリック時  |
|  dblclick  |  ダブルクリック時  |
|  mousedown  |  マウスボタンを押したとき  |
|  mouseup  |  マウスボタンを離したとき  |
|  mouseenter  |  マウスポインター が要素に入ったとき  |
|  mousemove  |  マウスポインター が要素内を移動したとき  |
|  mouseleave  |  マウスポンターが要素から離れたとき  |
|  focus  |  要素にフォーカスしたとき  |
|  blur  |  要素からフォーカスが離れたとき  |
|  keydown  |  キーを押したとき  |
|  keypress  |  キーを押し続けているとき  |
|  keyup  |  キーを話したとき  |
|  input  |  入力内容が変更されたき  |
|  select  |  テキストが選択されたとき  |
|  reset  |  リセット時  |
|  submit  |  サブミット時  |

実際にイベントバインディングを試してみましょう。
```js
import { Component } from '@angular/core';

@Component({
  selector: 'my-app', 
  template: `<div>{{msg}}</div>
             <input type="button" (click)="show()" value="入力"/>
            ` 
})

export class AppComponent {
  msg = '---';

  show() {
    this.msg = "Hello World";
  }
}
```
上記は`(click)="show()"`ユーザーがボタンをクリックしたときに`showメソッド`を呼び出しています。
呼び出している`showメソッド`は、`msg`に新たな文字列を代入しています。これによってユーザーがボタンを押せば---がHello Worldの文字に切り替わります。

<img width="69" alt="スクリーンショット 2020-06-21 17 29 02" src="https://user-images.githubusercontent.com/57429437/85220218-b4798680-b3e4-11ea-92aa-797f88eab09b.png">

<img width="87" alt="スクリーンショット 2020-06-21 17 29 15" src="https://user-images.githubusercontent.com/57429437/85220222-bd6a5800-b3e4-11ea-86db-5b08c25d8525.png">

これでイベントによって処理を実行することができました。
#### イベント情報の取得
それでは次に発火したイベントの情報を取得してみましょう。
```js
@Component({
  selector: 'my-app', 
  template: `<div>{{msg}}</div>
             <input type="button" (click)="show($event)" value="入力"/>
            ` 
})

export class AppComponent {
  msg = '---';

  show(e: MouseEvent) {
    this.msg = "Hello World";
    console.log(e);
  }
}
```
`showメソッド`の引数に`$event`オブジェクトを渡すことでイベントの一覧を取得することができます。試しに`showメソッド`内で`console.log`を使いデバッグしてみると下記画像のように表示されます。

<img width="553" alt="スクリーンショット 2020-06-21 19 15 29" src="https://user-images.githubusercontent.com/57429437/85222053-949d8f00-b3f3-11ea-924c-c3cf2ed44f83.png">

上記で取得できたイベント情報を使用して様々な実装ができるようになります。
- マウスのカーソルの位置を取得
- 入力されたキー情報の取得
- 入力された情報を使いキー入力に制限をかける
etc...
#### preventDefault
`preventDefault`はイベントのデフォルト動作をキャンセルする動きをします。
リンクをクリックしたときに別ページに推移したりsubmitボタンを押せば入力した情報を送信したりするイベントのことです。
`input`タグで値を入力したときに入力した文字が表示されるのもこのイベントに当たります。
例えば入力欄で電話番号を入力させたいときに何もしなければどんな文字でも入力することができます。しかしこの処理はユーザーに対して不親切でありまた、不要なエラーを起こしてしまう可能性もあります。
なので入力するときに数字のみを入力するように設定してあげましょう。`preventDefault`を使えば簡単に実装を行うことができます。
```js
@Component({
  selector: 'my-app', 
  template: `<label for="tel">電話番号:</label>
             <input id="tel" type="text" size="15" (keypress)="show($event)"/>
            ` 
})

export class AppComponent {
  show(e: any) {
    let k = e.which;
    if (!((k >= 48 && k <= 57) || k === 45 || k === 8 || k === 0)) {
      e.preventDefault();
    }
  }
}
```
イベント情報を受け取りif文で制限をかけてその制限に当てハマるものに対して`preventDefault`を動かしイベントをキャンセル(=入力を受け付けない)しています。
これでinputタグには期待した値のみ入力が可能になりました。

#### stopPropagation
`stopPropagation`はネスト構造で子要素のイベントが発火したときに親要素に対しても影響を与えてしまうことを防ぐ働きをします。
例えばネスト構造になったクリックボタンがあったとします。
何もしなければ、子要素のクリックボタンを押して子要素のイベントのみを発火させたいのに、親要素のイベントまで発火してしまいます。
```js
@Component({
  selector: 'my-app', 
  template: `<div id="adult" (click)="onclick1()">親
               <div id="child" (click)="onclick2($event)">子</div>
             </div>
            ` 
})

export class AppComponent {
  onclick1(e: any) {
    console.log("親要素をクリックしました;");
  }

  onclick2(e: any) {
    console.log("子要素をクリックしました;");
  }
}
```

<img width="141" alt="スクリーンショット 2020-06-21 20 09 02" src="https://user-images.githubusercontent.com/57429437/85223088-0f1ddd00-b3fb-11ea-9894-be734abcd3c0.png">

親要素をクリックしたときには親要素のイベントのみが発火するのに対して、子要素をクリックしたときには両方のイベントが発火してしまいます。
なので`stopPropagation`を使用して親要素のイベントが発火しないように実装を変更しましょう。
```js
  onclick2(e: any) {
    e.stopPropagation();
    console.log("子要素をクリックしました;");
  }
```
子要素のイベントに対して`e.stopPropagation();`をつけてあげることで子要素のイベントが親要素に影響しないようにできます。
これはイベントのバブリングというイベントが上へ上へと上がって行き、上位要素に影響を与えてしまう動きを止めているからです。

<img width="160" alt="スクリーンショット 2020-06-21 20 13 09" src="https://user-images.githubusercontent.com/57429437/85223165-a2571280-b3fb-11ea-8ee4-05346a7334e2.png">

#### テンプレート参照変数
今まで`$event`オブジェクトを使用して全てのイベント情報を取得してきました。
ただ要素オブジェクトを取得するために全ての情報を取得するのは処理が冗長になってしまいます。
例えば`input`タグに入力した値を取得したいのに、イベント情報を全て取ってくる処理をするのは無駄が多いですよね。`input`に入力された値のみを取得したい場合には、テンプレート参照変数というものを使えば簡単に実装を行うことができます。
```js
@Component({
  selector: 'my-app', 
  template: `<label for="tel">電話番号:</label>
             <input #tel id="tel" name="tel" type="text" size="15" (input)="show(tel.value)"/>
             <ul [innerHTML] = "msg"></ul>
            ` 
})

export class AppComponent {
  msg = "";
  show(input: string) {
    this.msg += `<li>${input}</li>`
  }
}
```
`inputタグ`に任意の変数`#tel`をつけることによってテキストボックスに入力された値を`tel.value`として直接取得することができる。
要素の値を受け渡したりするときにはテンプレート参照変数を使うことを意識しましょう。

### [双方向バインディング](https://angular.jp/guide/template-syntax#%E5%8F%8C%E6%96%B9%E5%90%91%E3%83%90%E3%82%A4%E3%83%B3%E3%83%87%E3%82%A3%E3%83%B3%E3%82%B0-)
双方向バインディングとは、簡単に言ってしまえばプロパティバインディングとイベントバインディングのシンタックスシュガーです。プロパティバインディングはアプリ側からビュー側に値を渡し、イベントバインデュングはビュー側からアプリ側に値を渡します。この動き２つを両方行うのが双方向バインディングです。
```js
@Component({
  selector: 'my-app', 
  template: `
    <form>
      <label for="name">名前:</label>
      <input id="name" name="name" type="text" [(ngModel)]="myname" />
      <div>こんにちは、{{myname}}さん!</div>
    </form>
            ` 
})

export class AppComponent {
  myname = "山田";
}
```
プロパティバインディングとイベントバインディングの括弧を合わせた[()]で実装できます。双方向バインディング内で`ngModel`をしてすることで、`inputタグ`に入力した値をmynameに渡すことができ、mynameにはアプリ側で値を渡しておくこともできます。
## 参考文献

[ 公式 ]
[Angular](https://github.com/angular/angular)
[Angular ドキュメント](https://angular.jp/docs)
