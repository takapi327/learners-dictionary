# TypeScript 型について
## 目次
### プリミティブ型
そのプログラミング言語に最初から用意されている変数の型のうち、基本的な型
```
string, number, boolean, symbol, bigint, null, undefined, etc...
```

```ts
let name: string = "hogehoge";

name = 5;
// Type 'string' is not assignable to type 'number'.
```

nullとunderfinedは他の型として扱うことができてしまう。
上記を許容していると例外処理が発生してしまう可能性があるので、極力避けたい。
```ts
let name: string = null;

name = undefined;
```

プリミティブ型の値にnullやunderfinedが代入されてしまった場合に、エラーを出させる機能としてstrictNullChecksがある。下記のようにtsconfig.json内で値をtrueとして機能をオンにするとコンパイルでエラーを履いて検知してくれるようになる。
#### tsconfig.json
```ts
{
  "compilerOptions": {
    ...
    "strictNullChecks": true, /* 厳密なヌルチェックを有効にします。 */
    ...
  }
}
```
### リテラル型(literal type)
リテラル型とはプリミティブ型を細分化したものです。具体的にいうとプリミティブ型はstringやnumberといった型自体で制約をかけていましたが、リテラル型はその型を下記のようにもっと狭くします。
```ts
let name: 'hogehoge' = 'hogehoge';

name = 'hugahuga';
// Type '"hugahuga"' is not assignable to type '"hogehoge"'.
```

nameは文字列(string)の'hogehoge'型となっており、’hogehoge’という文字以外を受け付けなくなりました。
同じstring型でもある特定の文字だけとして型を指定できるのが、リテラル型です。
※リテラル型はstring型のようにプリミティブ型と同じような型もしてできます。

### 型推論
型推論とは、リテラル型で上記のように明示的に型を指定しなくても型を指定できることです。
```ts
const name = "hogehoge";

name = "hugahuga";
// Type '"hugahuga"' is not assignable to type '"hogehoge"'.
```
上記のように明示的に型を指定しなくても、定数nameは文字列の"hogehoge"以外を代入できなくなりました。
これが型推論の働きです。
JavaScriptを触った方はわかるとご存知だと思いますが、JSでconstとは再代入することができない変数を指しています。つまり上記の場合だと変数nameは永続的に"hogehoge"だと保証されて、他の値で書き換えることができないということになります。
なので、明示的に型を指定しなくてもconstで指定した変数はリテラル型を同じように扱うことができるということです。
## 参考文献
[公式]
[Intro to the TSConfig Reference](https://www.staging-typescript.org/tsconfig)

[「分かりそう」で「分からない」でも「分かった」気になれるIT用語辞典](https://wa3.i-3-i.info/word15876.html)<br>
[strictNullChecks](https://typescript-jp.gitbook.io/deep-dive/intro/strictnullchecks)
[tsconfig.jsonの全オプションを理解する(随時追加中)](https://qiita.com/ryokkkke/items/390647a7c26933940470)
[TypeScriptチュートリアル① -環境構築編-](https://qiita.com/ochiochi/items/efdaa0ae7d8c972c8103)
