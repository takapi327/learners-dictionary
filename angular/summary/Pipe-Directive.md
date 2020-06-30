# Angular
## 目次
- [パイプ]()
  - [JSON形式]()
  - [date]()
- [ディレクティブ]()
  - [コンポーネント]()
  - [構造ディレクティブ]()
    - [ngIf]()
    - [ngSwitch]()
    - [ngFor]()
    - [ngStyle]()
      - [トラッキング式]()
  - [属性ディレクティブ]()
- [参考文献]()
## [パイプ](https://angular.jp/guide/pipes#%E3%83%91%E3%82%A4%E3%83%97)
パイプとは、テンプレートに埋め込まれている値に対して加工/整形する処理を行います。
### Angular標準のパイプ一覧
|  パイプ  |  概要  |
| ---- | ---- |
|  lowercase  |  大文字から小文字へ  |
|  uppercase  |  小文字から大文字へ  |
|  titlecase  |  単語の戦闘文字を大文字に変換  |
|  slice  |  文字列から部分文字列を切り出し  |
|  date  |  日付/時刻を整形  |
|  number  |  数値を桁区切りで整形  |
|  percent  |  数値をパーセント形式に整形  |
|  currency  |  数値を通貨形式に整形  |
|  json  |  オブジェクトをJSON形式に変換  |
|  i18nPlural  |  数値によって表示文字列を変換  |
|  i18nSelect  |  文字列に応じて出力を切り替え  |
|  async  |  Observable/Promiseによる非同期処理の結果を取得  |

実際に`lowercase`,`uppercase`,`titlecase`を使用してどのような動きをするのか見てみましょう。
```js
@Component({

  selector: 'my-app', 
  template: `
    <p>元の文字列: {{name}}</p>
    <p>uppercase:  {{name | uppercase}}</p>
    <p>lowercase:  {{name | lowercase}}</p>
    <p>titlecase:  {{name | titlecase}}</p>
  ` 
})

export class AppComponent {
  name = "YAMADA tarou";
}
```
上記で下記画像のようにコンポーネントで渡した値に対して加工を加えています。

<img width="192" alt="スクリーンショット 2020-06-23 8 10 44" src="https://user-images.githubusercontent.com/57429437/85343861-0aefdd80-b529-11ea-8132-dac738f77e0d.png">

### JSON形式
JSONとはJavaScript Object Notationの略で、XMLなどと同様のテキストベースのデータフォーマットのことです。
Ajaxと利用することで、Angular側で取得した値をサーバーサイド側で処理ができるようになり、その逆もしかりです。サーバーから取得したデータはDHTML(Webページ上の表示に動きや変化を加えたり、利用者による操作に反応する仕組みを埋め込んだもの)を活用してコンテンツに動的に反映させる動きもできます。
```js
@Component({
  selector: 'my-app', 
  template: `
    <pre>{{obj | json}}</pre>
  ` 
})

export class AppComponent {
  obj: any = {
    name:   "山田",
    gender: undefined, // 表示されない
    birth:  new Date(2007,7,15),
    job:    function() {} // 表示されない
  };
}
```
上記実装はコンポーネントで生成した値をjson形式に変換して表示させています。
json形式を画面上でみやすく表示させるには、`pre`で囲んであげる必要があります。下記画像のような違いがあります。
jsonパイプは、上記記述でコメントしているように`functionk型`と`undefined`な値に関しては無視する働きがあります。(nullは正常に表示される)
#### pre
<img width="316" alt="スクリーンショット 2020-06-24 22 39 57" src="https://user-images.githubusercontent.com/57429437/85567208-a38e7680-b66b-11ea-82df-8c096f6224e6.png">

#### div
<img width="376" alt="スクリーンショット 2020-06-24 22 42 27" src="https://user-images.githubusercontent.com/57429437/85567624-fd8f3c00-b66b-11ea-9896-71dbbf2fb8cf.png">
### date
dateパイプは日付と時刻を指定したフォーマットに変換することができます。
dateを変換するための書式は下記に載っています。

[こちら](https://www.buildinsider.net/web/angularjstips/0027)


```js
@Component({
  selector: 'my-app', 
  template: `
    <ul>
      <li>{{currentDate | date}}</li>
      <li>{{currentDate | date: 'medium'}}</li>
      <li>{{currentDate | date: 'y MM dd (EEE)'}}</li>
      <li>{{currentDate | date: 'GGGG MMMM dd'}}</li>
    </ul>
  ` 
})

export class AppComponent {
  currentDate = new Date();
}
```
実際に現時刻を色々な形に変換してみたところ下記画像のようになりました。データベースに保管されているような値を変換するときに使えそうですね！

<img width="287" alt="スクリーンショット 2020-06-24 23 04 50" src="https://user-images.githubusercontent.com/57429437/85571437-1d742f00-b66f-11ea-92bc-9e88842cbf4d.png">

## [ディレクティブ](https://angular.jp/guide/attribute-directives)
### コンポーネント
### 構造ディレクティブ
| 名前 |  概要  |
| ---- | ---- |
|  ngif  |  式の真偽によって表示/非表示を切り替える |
|  ngSwitch  |  式の値によって表示を切り替える |
|  ngFor  |  配列をループ処理 |
|  ngTempleteOutlet  |  用意されたテンプレートの内容をインポート |
|  ngComponentOutlet  |  用意されたコンポーネントの内容をインポート |
#### ngIf
ngifディレクティブは、JavaScriptでのif文に該当しています。指定された条件式がtrueの場合にのみ要素を表示させます。

```js
@Component({
  selector: 'my-app',
  template:
    `
      <form>
        <label for="show">表示/非表示:</label>
        <input id="show" name="show" type="checkbox" [(ngModel)]="show" />
      </form>
      <div *ngIf="show">
        表示しています
      </div>
    `
})

export AppComponent {
  show = false;
}
```

上記は`templete`に表示非表示用のチェックボックスを作成して、真偽値によって切り替える実装を試しています。
`ngModel`の双方向バインディングを設定することによって、checkboxに真偽値のためのfalseを初期値として設定しています。
そして表示させたい要素に対して、`ngIf`を設定し、showがtrueの場合にのみ表示させるようにしています。

<img width="136" alt="スクリーンショット 2020-06-28 17 23 47" src="https://user-images.githubusercontent.com/57429437/85942420-22352d80-b964-11ea-857b-e324c8e6a536.png">
<br>
<img width="135" alt="スクリーンショット 2020-06-28 17 24 02" src="https://user-images.githubusercontent.com/57429437/85942424-2a8d6880-b964-11ea-912b-ed6585f68acd.png">


`ngIf`の特性は要素を表示/非表示していると説明しましたが、本当は真偽値によって要素を挿入/削除しています。<br>なぜそのような実装になっているのかというと、一般的にページ上の要素は表示/非表示に関係なく何らかのリソースを消費しています。つまり非表示の要素に対してもリソースを消費しているので、パフォーマンスが悪くなってしまう可能性があります。<br>なので`ngIf`ディレクティブでは非表示の要素を削除することによってリソースの消費を減らす働きをしています。<br>
では非表示にする要素全てを`ngIf`ディレクティブを使用して実装すればいいという訳ではありません。<br>
ページ上の要素によっては初期化するときに大きくリソースを消費してしまう物があるかもしれません。その実装に対しても`ngIf`ディレクティブを使用していては初期化表示するたびに大量のリソースを消費してしまう可能性がありますので、`ngIf`ディレクティブの特製が無駄なものになってしまい本末転倒です。
その場合には、スタイルバインディングを使用て要素の表示/非表示を実装した方が結果的にリソース消費を抑えることができます。
`ngIf`ディレクティブは、trueではなくfalseの場合にも要素を表示させておくことが可能です。
```js
@Component({
  selector: 'my-app',
  template:
    `
      <form>
        <label for="show">表示/非表示:</label>
        <input id="show" name="show" type="checkbox" [(ngModel)]="show" />
      </form>
      <div *ngIf="show; else elseContent">
        表示しています
      </div>
      <ng-templete #elseContent>
        <p>非表示にしています</p>
      </ng-templete>
    `
})

export AppComponent {
  show = false;
}
```
上記は`ngIf`ディレクティブにelseを追加してfalseの場合に呼び出すテンプレートの名前を設定しています。
falseのときに呼び出すテンプレートには、elseで設定したテンプレート名を設定して呼びさせるようにしています。
これでfalseのときにも下記画像のようにテンプレートを表示することができるようになりました。

<img width="128" alt="スクリーンショット 2020-06-28 18 00 46" src="https://user-images.githubusercontent.com/57429437/85943182-4cd5b500-b969-11ea-80fd-67a24964a9ee.png">

またfalse時のテンプレートだけではなく、true時のテンプレートも`then~else`を使用して設定することができます。
```js
@Component({
  selector: 'my-app',
  template:
    `
      <form>
        <label for="show">表示/非表示:</label>
        <input id="show" name="show" type="checkbox" [(ngModel)]="show" />
      </form>
      <div *ngIf="show; then trueContent; else elseContent"></div>

      <ng-templete #trueContent>
        <p>表示しています</p>
      </ng-templete>

      <ng-templete #elseContent>
        <p>非表示にしています</p>
      </ng-templete>
    `
})

export AppComponent {
  show = false;
}
```

#### ngSwitch
`ngSwitch`ディレクティブは、JavaScriptでいうswitch文に該当します。指定された値に応じて表示させるコンテンツを切り替えます。

```js
@Component({
  selector: 'my-app',
  templete:
    `
      <form>
        <select name="season" [(ngModel)]="season">
          <option value="">四季を選択</option>
          <option value="spring">春</option>
          <option value="summer">夏</option>
          <option value="autumn">秋</option>
          <option value="winter">冬</option>
        </select>
      </form>
      <div [ngSwitch]="season">
        <span *ngSwitchCase="'spring'">春の季節です</span>
        <span *ngSwitchCase="'summer'">夏の季節です</span>
        <span *ngSwitchCase="'autumn'">秋の季節です</span>
        <span *ngSwitchCase="'winter'">冬の季節です</span>
        <span *ngSwitchDefault>選択してください</span>
      </div>
    `
})

export AppComponent {
  season = '';
}
```

上記セレクトボックスで選択した値に応じて要素を表示させる実装を行っています。<br>
`ngIf`ディレクティブの実装と同様に双方向バインディングによって変化した値を元に表示させるものを変えています。<br>
セレクトボックスのvalueの値が変更すると双方向バインディングによってコンポーネントに渡され、`ngSwitch`ディレクティブはコンポーネントの値を判断して`ngSwitchCase`の値と一致したものを表示させています。

<img width="142" alt="スクリーンショット 2020-06-28 21 48 30" src="https://user-images.githubusercontent.com/57429437/85947991-1d36a500-b989-11ea-8a5b-94aae4e2b0d2.png">

<img width="111" alt="スクリーンショット 2020-06-28 21 48 45" src="https://user-images.githubusercontent.com/57429437/85948001-258ee000-b989-11ea-82fc-5f1d83dd8219.png">

#### ngFor
`ngFor`ディレクティブは配列から要素を取り出し、ループ処理をして一覧表示を行います。
JavaScriptのfor~ofに該当しています。
```js
@Component ({
  selector: 'my-app',
  templete:
    `
      <ul *ngFor="let u of users">
        <li>ID:{{u.id}}</li>
        <li>名前:{{u.name}}</li>
      </ul>
    `
})
export AppComponent {
  
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
}
```

上記は、コンポーネントに定義してある配列の要素を一覧表示しいている実装です。<br>
`ngFor`ディレクティブによって配列を要素ごとに分ける処理をしています。(users配列の要素をuに格納)<br>
要素に対して表示させたい値を指定してループ処理で一覧表示を行っています。

<img width="175" alt="スクリーンショット 2020-06-28 22 07 59" src="https://user-images.githubusercontent.com/57429437/85948424-d5654d00-b98b-11ea-834d-5b15dd1e97e2.png">

#### トラッキング式
トラッキング式とは、`ngFor`によるオブジェクト追跡のためのキーを決める式です。<br>
もしトラッキング式を使用していない`ngFor`ディレクティブの実装を行った場合、データベースから値を取得するたびに1から全て生成しなおして表示を行ってしまいます。<br>
```js
@Component ({
  selector: 'my-app',
  templete:
    `
      <ul *ngFor="let u of users">
        <li>ID:{{u.id}}</li>
        <li>名前:{{u.name}}</li>
      </ul>
      <input type="button" (click)="onclick()" value="更新">
    `
})
export AppComponent {
  
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
}
```
例えば上記処理では、配列に新しい値を追加/削除する実装を行ったとします。本来であれば追加された(削除された値を除いた)値のみを更新して一覧表示を行いたいのですが、トラッキング式を実装しない場合は追加/削除されたたびに全ての要素を読みとって再度生成を行ってしまいます。<br>
これは`ngFor`ディレクティブがどこまでの値が変更されたのかの情報を取得できないからです。<br>
トラッキング式を追加することで、現在のインデックス情報や項目情報を渡してあげることができ、この情報を元に追加された(削除された値を除いた)値に対してのみ処理を行います。
```js
<ul *ngFor="let u of users; trackBy: trackFn">
  <li>ID:{{u.id}}</li>
  <li>名前:{{u.name}}</li>
</ul>

export class AppComponet {
  trackFn(index: any, user: any){
    return user.id;
  }
}
```
上記のように`ngFor`ディレクティブに、コンポーネントで設定したトラッキング式を渡しています。<br>
コンポーネントないではトラッキング式を定義して引数に現在のインデックス情報と値を渡しています。そして戻り値を渡された値のidに設定しています。これでidをキーとしてキーが既存の項目と等しい値は更新されず、新しい値のみが追加されるようになります。
### ngStyle
`ngStyle`ディレクティブは、スタイルバインディングが1度に１つのスタイルしか設定できなかったのに対して、複数のスタイルを設定することができるディレクティブです。
```js
@Component ({
  selecter: 'my-app',
  templete:
    `
      <div [ngStyle]="style">
        <p>スタイル</p>
      </div>
    `
})

export class AppComponent {
  style = {
    backgroundColor: '#f00',
    color:           '#fff',
    fontWeight:      'bold'
  };
}
```

上記のようにスタイルをまとめて定義して実装を行うことができます。

<img width="183" alt="スクリーンショット 2020-06-28 23 23 07" src="https://user-images.githubusercontent.com/57429437/85950193-54f81980-b996-11ea-969c-cf11a317c52e.png">

### ngTempleteOutlet
`ngTempleteOutlet`ディレクティブは、予め定義しておいたテンプレートをコンポーネント内の任意の場所に挿入できます。

```js
@Component ({
  selecter: 'my-app',
  templete:
    `
      <ng-template #myTemp 
        let-id     = "id" 
        let-name   = "name" 
        let-gender = "gender" 
        let-age    = "age"
      >
        <ul>
          <li>ID:{{id}}</li>
          <li>名前:{{name}}</li>
          <li>性別:{{gender}}</li>
          <li>年齢:{{age}}</li>
        </ul>
      </ng-template>
      
      <select name="temp" [(ngModel)]="temp">
        <option *ngFor="let user of users; let i = index" [value]="i">
          {{user.name}}
        </option>
      </select>
      <ng-container *ngTemplateOutlet="myTemp; context: users[temp]"></ng-container>
          `
})

export class AppComponent {
  temp = 0;
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

}
```
上記で`ng-template`で囲んだテンプレートを予め定義しておく`#myTemp`と後でテンプレートとして使えるように設定しておく。
セレクトボックスを作成し、双方向バインディングで設定した値に選択した要素のインデックスを渡し、セレクトボックスが今何番目の値を選択しているのかの情報を取得している。そしてその情報をテンプレートを呼び出すときに`users`に渡すことで配列から何番目の`users`要素を取得するかを決めている。

### ngComponentOutlet
`ngComponentOutlet`ディレクティブを使用することで予め定義しておいたコンポーネントを動的にビューにインポートできるようになります。<br>

```js
export class AppComponent implements OnInit, OnDestroy {
  interval: any;
  comps = [TryAngular2Component];
  current = 0;
  banner: any = TryAngular2Component;
  ngOnInit() {
    this.interval = setInterval(() => {
      this.current = (this.current + 1) % this.comps.length;
      this.banner = this.comps[this.current];
    }, 3000);
  }

  ngOnDestroy() {
    clearInterval(this.interval);
  }
}
```
intervalに設定したタイマーを入れれるようにany型で設定。<br>
compsという配列を作り順番に表示したいコンポーネントを配列として渡してあげる。<br>
currentで現在のインデックス番号を設定、初期値を0に設定。<br>
bannerにはインデックス番号に対応したコンポーネントを設定する。<br>
ngOnInit内でタイマー情報を設定する。`setInterval`メソッドを使用しインデックス情報に配列の要素数と初期値を除いたもので計算を行い0〜最大インデックスの範囲で循環するように設定。<br>
bannerにcomps配列の先ほどのインデックス情報を渡し、3000ms感覚で切り替え表示するように設定。<br>
そしてbanner情報をビューに渡すことで画面表示を行っている。

### 属性ディレクティブ
## 参考文献
[JSONってなにもの？](https://thinkit.co.jp/article/70/1)

[パイプを使用して日付をdd/MM/yyyyとしてフォーマットする](https://www.it-swarm.dev/ja/date/%E3%83%91%E3%82%A4%E3%83%97%E3%82%92%E4%BD%BF%E7%94%A8%E3%81%97%E3%81%A6%E6%97%A5%E4%BB%98%E3%82%92ddmmyyyy%E3%81%A8%E3%81%97%E3%81%A6%E3%83%95%E3%82%A9%E3%83%BC%E3%83%9E%E3%83%83%E3%83%88%E3%81%99%E3%82%8B/824070226/)

[日付／時刻データを整形するには？（date）](https://www.buildinsider.net/web/angularjstips/0027)
