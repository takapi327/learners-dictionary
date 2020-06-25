# Option型　まとめ
---
- [Option型](#Option型)  
  - [概要](#概要)
  - [メリット](#メリット)
  - [実装例](#実装例)
- [各種メソッド](#各種メソッド) 
  - [値の取得](#値の取得)
    - [get](#get) 
    - [getOrElse](#getOrElse) 
  - [真偽値の取得](#真偽値の取得)
    - [isEmpty](#isEmpty)
    - [isDefined](isDefined)
  - [map,flatMap](#map)  
    - [map](#map) 
    - [flatMap](#flatMap) 
  - [参考文献](#参考文献)  

## *[Option型](https://github.com/scala/scala/blob/2.12.x/src/library/scala/Option.scala)*

### 概要

Optionは、2つの子クラスを持っている。
返したい値はSomeに入れて返す、Someクラスと処理できなかった事を表すときにNoneを返す、Noneオブジェクトがある。
このOptionを使うことで、何かの処理結果（オブジェクト）を返すメソッドにおいて、処理できなかった場合(エラー)の処理を事前に決めておくことができ、Javaのようにnullを返すことで起こる、NullPointerExceptionというエラーをなくすことができる。

Scalaの[GitHub](https://github.com/scala/scala/blob/2.12.x/src/library/scala/Option.scala#L29)を見るとどういう処理を行なっているのかがわかりやすいです。
```scala
def apply[A](x: A): Option[A] = if (x == null) None else Some(x)
```
Scalaは括弧で囲んだ1つ以上の値を変数に適用したコードであれば、そのコードを変数の`applyメソッド`呼び出しに書き換えることができる。そしてこの`applyメソッド`は省略することが可能。
つまりOption型も呼び出す際には、Optionの`applyメソッド`を呼び出して処理をしている。
それを踏まえた上で上記を確認すると、渡された引数を条件式によってNoneとSomeで分けているとわかる。

実際に引数を渡して実装を試してみる。
```scala
// Option型で引数にhelloを持たせる
scala> Option("hello")
// 型推論によりStringと判定、値を持っているのでSomeに包まれて返される
res0: Option[String] = Some(hello)

// Optionにnullを持たせる
scala> Option(null)
// 値が何もない時とnullの時は、Noneが返される
res1: Option[Null] = None
```

### メリット
エラーを発見する方法として、かく機能ごとにテストを書き、実行時にエラーを確認する必要がありますが、
Option型で重要な点は、実行時ではなくコンパイル時にエラーを発見できる点です。このおかげで１度コンパイルをするだけでエラーを発見できます。
これができるのはOption型が値を持つ時に上記2種類しか型を持たないからです。
値がなかった時には、Noneを返すことからNullを返すことがなく、Nullによるエラーが起こらないからです。

### 実装例
```scala
// DBに保存する型を決めています。
case class Todo (
  id:           Int,
  categoryId:   Option[Category.Id] // categoryIdのみOption型で包まれています。
)
```
categoryIdは別テーブルのCategoryとアソシエーションが組まれていると考えてください。
もしOptionではなくIntなどで実装していた場合、アソシエーションを組んでいるCategoryが削除されてしまった場合、該当しているcategoryIdがないというエラーを起こしてしまう可能性が高まります。

Categoryを削除した時に、categoryIdの値も同時に変更する処理を書く必要がありますが、この処理を簡単に実装できるのがOption型です。
Optionで包むことによって値が存在した場合には、Someに包んで返してくれ、なかった場合には値をNoneとして処理を行うことができます。

その他にもSomeの場合とNoneの場合で処理を分けて他の実装を行うこともできます。

例: 値の有無によって表示方法の変更
例: 値の有無によってViewなどに送るデータの選別
例: 値の有無によってエラーハンドリングの実装
etc...

## *値の取得*
### [get](https://github.com/scala/scala/blob/2.12.x/src/library/scala/Option.scala#L173)
Optionの`getメソッド`はその名の通りOptionの値を取得するメソッドです。

```scala
// 実装内容
def get: A
~~~
// 下記コメントアウト
* option match {
*   case Some(x) => x
*   case None    => default
* }
```
Scalaの実装内容を確認すると上記のようになっている。おそらくOptionをパターンマッチで処理を行いSomeならその中の値を、Noneならdefaultを返している。

実際に使ってみると、このdefaultはエラー文になっており例外処理を返していると思われる。
```scala
scala> Option(1245)
val res1: Option[Int] = Some(1245)

// case Some(x) => x
scala> res1.get
val res2: Int = 1245

// case None => default
scala> None.get
java.util.NoSuchElementException: None.get
  at scala.None$.get(Option.scala:627)
  ... 32 elided
```

### [getOrElse](https://github.com/scala/scala/blob/2.12.x/src/library/scala/Option.scala#L188)

`getOrElseメソッド`は、Optionの値が存在している場合は通常通りSomeに包まれた値を返す。Optionに値がない、もしくはNoneの場合に`getOrElseメソッド`に渡した引数を表示する。
Scalaの実装内容を確認すると複雑そうな処理を行っているように見える。
簡単に説明すると`getOrElseメソッド`の引数に渡したものにdefaultの値を変換している。
条件式で後に説明する`isEmptyメソッド`(Booleanを返すメソッド)を使い処理を分けている。処理がdefaultになった場合には、`getOrElseメソッド`の関数を使い引数に渡したBに変換している。

```scala
 @inline final def getOrElse[B >: A](default: => B): B =
    if (isEmpty) default else this.get
```
実際に例外処理が引数に渡した値に置き換えられているかを確認してみる。
```scala
// helloにOption型の値を渡す
scala> val hello: Option[String] = Some("こんにちは")
hello: Option[String] = Some(こんにちは)

// helloに値があるのでgetOrElseは動かない
hello.getOrElse("さようなら")
res2: String = こんにちは

// helloにNoneを渡す
scala> val hello: Option[String] = None
hello: Option[String] = None

// helloに値がないもしくはNoneの場合は、getOrElseの引数が表示される
scala> hello.getOrElse("さようなら")
res3: String = さようなら
```

上記コードのようにgetOrElseを使うことで、値がない場合にNullとしてエラーを返すことなく処理を実行できる。

## *真偽値の取得*
### [isEmpty](https://github.com/scala/scala/blob/2.12.x/src/library/scala/Option.scala#L147)
`isEmptyメソッド`はScalaの実装内容の通りBoolean型(真偽値)を返すメソッドです。
実装内容はコメントアウトの通りで値がSomeであった場合にfalseを返し、Noneであった場合にtrueを返す。

```scala
def isEmpty: Boolean
```
### [isDefine](https://github.com/scala/scala/blob/2.12.x/src/library/scala/Option.scala#L159)
`isDefineメソッド`は`isEmptyメソッド`と逆の処理をするメソッドです。
Scalaの実装を見てわかる通り!isEmptyでisEmptyじゃなかったら(falseじゃない == true)Someのときtrueを返す処理を行う。
```scala
def isDefined: Boolean = !isEmpty
```

isEmptyとisDefinedは、Option型で値があるかないかをtrue,falseで確認するメソッド
・isEmpty(Noneでtrue)
・isDefined(値がある場合にtrue)
上記を踏まえて両方の実装を確認してみる。

```scala
// trにOption[Int]の5を渡す
scala> val tr:Option[Int] = Option(5)
tr: Option[Int] = Some(5)

// faにNoneを渡す
scala> val fa:Option[Int] = None
fa: Option[Int] = None

// isEmptyは値があるとfalse
scala> tr.isEmpty
res5: Boolean = false

// 値がない、もしくはNoneの時にtrue
scala> fa.isEmpty
res6: Boolean = true

// isDefinedは値があるとtrue
scala> tr.isDefined
res7: Boolean = true

// 値がない、もしくはNoneの時にfalse
scala> fa.isDefined
res8: Boolean = false
```

## *map,flatMap*
### [map](https://github.com/scala/scala/blob/2.12.x/src/library/scala/Option.scala#L229)
Scalaでの実装は下記のようになっています。
```scala
@inline final def map[B](f: A => B): Option[B] =
    if (isEmpty) None else Some(f(this.get))
```

実装内容を見ると難しいので結果簡単にいうと、OptionやSeqなどの中に入っている値を個別加工したい時に使う！です。
これでだいぶ難しく考えずに使うことができるはず！僕はそうでしたw

下記のOption[Int]型をOption[String]に変更したい場合などに使えます。
```scala
val optString: Option[String] = Some("555")
val optInt: Option[Int] = optString.map(x => x.toInt)

上記処理をマップを使わずに行うとエラーになる
scala> val optInt = optString.toInt
                              ^
       error: value toInt is not a member of Option[String]
```
わかりやすく書くとイメージとしてはこんな感じ
```scala
val optString: Option[A] = Some("555")
val optInt: Option[A.toInt] = optString.map(A => A.toInt)
```
考えとしては、Optionで包んだ値をOptionを一旦無視して中の値に対して処理を行い、処理が終わった値をOptionに入れ直すようなイメージです。
ピーマンの肉詰めみたいな(?)
生のピーマンがOption[A]、包丁がmap、肉がmapで処理した値
ピーマンを包丁で切って中身をくり抜いて肉を詰めて返すようなイメージ(考えるな感じろ！)

### [flatMap](https://github.com/scala/scala/blob/2.12.x/src/library/scala/Option.scala#L270)

```scala
 @inline final def flatMap[B](f: A => Option[B]): Option[B] =
    if (isEmpty) None else f(this.get)
```

`flatmap`は`map`と`flatten`が一つに合わさったメソッドです。
処理内容としては、入れ子構造になっているものを1つにまとめて返すことができます。
```scala
val seqSeqInt: Seq[Seq[Int]] = Seq(Seq(1),Seq(2,3))
val seqInt: Seq[Int] = seqSeqInt.flatmap (f => f)
// Seq(1,2,3)
```
またOptionを外して返すこともできますし、Optionにして返すこともできます。
```scala
scala> Seq(Some(1), Some(2)).flatMap(a => a)
res0: Seq[Int] = List(1, 2)

scala> Seq(Some(1), Some(2)).flatMap(a => Some(a))
res1: Seq[Some[Int]] = List(Some(1), Some(2))
```

## *参考文献*
---
[Scala object Option](https://github.com/scala/scala/blob/2.12.x/src/library/scala/Option.scala)

[Scala Option(Some・None)](https://www.ne.jp/asahi/hishidama/home/tech/scala/option.html)

[[Scala]OptionとListのmap()に感動する](https://qiita.com/takudo/items/dca70d8b2a639a7663d9)

[flatMapをマスターする](https://qiita.com/mtoyoshi/items/c95cc88de2910945c39d#flatten--map)

[Scalaオブジェクト](https://www.ne.jp/asahi/hishidama/home/tech/scala/object.html)

Scalaスケーラブルプログラミング
(P85,4.4章,Scalaアプリケーション),(P280, 15.6章, Option型),(P473, 24.7章, マップ),
