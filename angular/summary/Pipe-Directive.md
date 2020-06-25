# Angular
## 目次
- [パイプ]()
  - [JSON形式]()
  - [date]()
- [ディレクティブ]()

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
## 参考文献
[JSONってなにもの？](https://thinkit.co.jp/article/70/1)

[パイプを使用して日付をdd/MM/yyyyとしてフォーマットする](https://www.it-swarm.dev/ja/date/%E3%83%91%E3%82%A4%E3%83%97%E3%82%92%E4%BD%BF%E7%94%A8%E3%81%97%E3%81%A6%E6%97%A5%E4%BB%98%E3%82%92ddmmyyyy%E3%81%A8%E3%81%97%E3%81%A6%E3%83%95%E3%82%A9%E3%83%BC%E3%83%9E%E3%83%83%E3%83%88%E3%81%99%E3%82%8B/824070226/)

[日付／時刻データを整形するには？（date）](https://www.buildinsider.net/web/angularjstips/0027)
