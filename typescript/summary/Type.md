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
## 参考文献
[公式]
[Intro to the TSConfig Reference](https://www.staging-typescript.org/tsconfig)


[「分かりそう」で「分からない」でも「分かった」気になれるIT用語辞典](https://wa3.i-3-i.info/word15876.html)<br>
[strictNullChecks](https://typescript-jp.gitbook.io/deep-dive/intro/strictnullchecks)
[tsconfig.jsonの全オプションを理解する(随時追加中)](https://qiita.com/ryokkkke/items/390647a7c26933940470)
