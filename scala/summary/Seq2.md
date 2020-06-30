# Seq[T]型　まとめ2
---
- [sorted](#)
- [sortBy](#sortBy)
- [sortWith](#sortWith)
- [Ordered[T]](#Ordered[T])
- [Ordering[T]](#Ordering[T])
- [参考文献](#参考文献)

## sorted
---
[sortedメソッド](https://github.com/scala/scala/blob/2.12.x/src/library/scala/collection/SeqLike.scala#L647)は 、Seq[A]の要素を並び替えるときに使うメソッドの内の１つです。

```scala
scala> val num: Seq[Int] = Seq(3,4,1,5,2)
num: Seq[Int] = List(3, 4, 1, 5, 2)

scala> num.sorted
res4: Seq[Int] = List(1, 2, 3, 4, 5)
```
sortedメソッドは順番を並び替えたいものの後ろに付けるだけでソートを行ってくれます。
では何故上記のような処理ができるのでしょうか。
それは[sorted](https://www.ne.jp/asahi/hishidama/home/tech/scala/collection/method.html#sorted)暗黙のOrdering[A]を引数としているからです。
[Ordering[A]](https://github.com/scala/scala/blob/2.12.x/src/library/scala/math/Ordering.scala#L72)は、暗黙の値でありこれを渡しておくとコンパイル時に暗黙的に型を変換してくれます。
```scala
// 文字のソート
scala> val str: Seq[String] = Seq("a","c","d","b")
str: Seq[String] = List(a, c, d, b)

scala> str.sorted
res6: Seq[String] = List(a, b, c, d)
```
上記処理は、数字をソートしたときと同じように実装されていますが、明示的に実装してみると違っているのがわかります。

```scala
scala> num.sorted(Ordering.Int)
res4: Seq[Int] = List(1, 2, 3, 4, 5)

scala> str.sorted(Ordering.String)
res7: Seq[String] = List(a, b, c, d)
```
数字はInt型、文字はString型でソートをするように明示的に処理を行っていますが、sortedは元々Ordering[A]を引数としておりコンパイル時に中身のAがSeqの中を見て暗黙のうちに型変換を行ってくれているので、型を指定しなくても並び替えを行うことができるのです。
ただ上記はSeqの中がAnyのような場合には使用することができない。

```scala
scala> val strInt = Seq(1,"1")
strInt: Seq[Any] = List(1, 1)

scala> strInt.sorted
<console>:13: error: No implicit Ordering defined for Any.
       strInt.sorted
              ^
```
上記は明示的に型を指定してソートを行ったとしても同じようにエラーとなる。

## sortBy
---
[sortBy](https://www.ne.jp/asahi/hishidama/home/tech/scala/collection/method.html#sortBy)には、要素AをBに変換し、Bでソートされたコレクションを返すという処理を行うことができます。
どいうことかというと上記でソートを行うときは、Ordering[A]で型を暗黙的に指定しなければなりませんでした。
しかし下記クラスにはOrdering.Intなどの値が存在せずTodo独自の値を持っています。
 なので今回の場合だと、Ordering[status]を作って上げる必要があります。Todo の値を受け取り、Int である status の値を返すことによって、暗黙的に Ordering[Int]になりソートできるようになります。 つまり Ordering[ソートしたい型] が存在しないものでも、Ordering[ソートできる型] に変換することでソートできるようになります。
sortByは要素AをBに変換し、Bでソートされたコレクションを返すという処理を行うことができるため下記のように簡単に実装を行うことができます。

```scala
scala> case class Todo(
     |   id: Long,
     |   title: String,
     |   body: String,
     |   status: Int
     | )
defined class Todo

scala> val seq = Seq(
     |   Todo(1,"HTML","勉強",1),
     |   Todo(2,"CSS","フロントエンド",2),
     |   Todo(3,"js","ビュー",3),
     |   Todo(4,"Scala","研修",2),
     |   Todo(5,"Java","バックエンド",1)
     | )
seq: Seq[Todo] = List(Todo(1,HTML,勉強,1), Todo(2,CSS,フロントエンド,2), Todo(3,js,ビュー,3), Todo(4,Scala,研修,2), Todo(5,Java,バックエンド,1))

scala> seq.sortBy(todo => todo.status)
res19: Seq[Todo] = List(Todo(1,HTML,勉強,1), Todo(5,Java,バックエンド,1), Todo(2,CSS,フロントエンド,2), Todo(4,Scala,研修,2), Todo(3,js,ビュー,3))
```

上記処理をsortedを使用した場合、ソートしたい要素を比較して実装することができます。
しかし記述が長くなるので素直にsortByを使った方が良さそう？

```scala
scala> seq.sorted(Ordering.fromLessThan[Todo]((x, y) =>
     |   x.status.compareTo(y.status) match {
     |     case 0 =>
     |       x.title.compareTo(y.title) match {
     |         case 0 => x.body.compareTo(y.body) < 0
     |         case c => c < 0
     |       }
     |     case c => c < 0
     |   }
     | ))
res20: Seq[Todo] = List(Todo(1,HTML,勉強,1), Todo(5,Java,バックエンド,1), Todo(2,CSS,フロントエンド,2), Todo(4,Scala,研修,2), Todo(3,js,ビュー,3))
```

## sortWith
---
sortWithは、引数で渡した値で比較し、ソートしたコレクションを返す処理をする。
上記hの処理をsortWithでも実装してみる。
```scala
scala> seq.sortWith((todo1,todo2) => todo1.status < todo2.status)
res26: Seq[Todo] = List(Todo(1,HTML,勉強,1), Todo(5,Java,バックエンド,1), Todo(2,CSS,フロントエンド,2), Todo(4,Scala,研修,2), Todo(3,js,ビュー,3))
```
引数に渡した値で比較してソートしていることがわかる。

## Ordered[T]
---
Ordered[T] はこれを継承することで、Tの型の値について並び替えをしたいときに使います。
予め並びの順番を決めておきたい場合に使用できそう。
[Ordered](https://github.com/scala/scala/blob/2.12.x/src/library/scala/math/Ordered.scala#L60)の中に比較の演算子が定義されているので、継承を行うことによって継承した先でも使用することができる。
traitで定義しているおかげですね。

```scala
scala> case class Todo(
     |   id: Long,
     |   title: String,
     |   body: String,
     |   status: Int
     | )extends Ordered[Todo] {
     |   def compare(that: Todo): Int = {
     |     if(this.status < that.status) -1 
     |     else if(this.status < that.status) 1 
     |     else 0
     |   }
     | }
defined class Todo

scala> val seq = Seq(
     |   Todo(1,"HTML","勉強",1),
     |   Todo(2,"CSS","フロントエンド",2),
     |   Todo(3,"js","ビュー",3),
     |   Todo(4,"Scala","研修",2),
     |   Todo(5,"Java","バックエンド",1)
     | )
seq: Seq[Todo] = List(Todo(1,HTML,勉強,1), Todo(2,CSS,フロントエンド,2), Todo(3,js,ビュー,3), Todo(4,Scala,研修,2), Todo(5,Java,バックエンド,1))

scala> seq.sorted
res27: Seq[Todo] = List(Todo(1,HTML,勉強,1), Todo(5,Java,バックエンド,1), Todo(2,CSS,フロントエンド,2), Todo(4,Scala,研修,2), Todo(3,js,ビュー,3))
```
## Ordering[T]
---
sortBy に渡したのと同じ関数で Ordering[T] の値を作ることができます。 Ordering.by のうしろは型パラメータで、1つ目がソートしたい型、2つ目が変換後のソートできる型です。

```scala
scala> val statusOrdering: Ordering[Todo] = Ordering.by[Todo, Int](todo => todo.status).reverse
statusOrdering: Ordering[Todo] = scala.math.Ordering$$anon$1@5dd92957

scala> seq.sorted(statusOrdering)
res4: Seq[Todo] = List(Todo(3,js,ビュー,3), Todo(2,CSS,フロントエンド,2), Todo(4,Scala,研修,2), Todo(1,HTML,勉強,1), Todo(5,Java,バックエンド,1))
```

```scala
scala> val myOrdering: Ordering[Todo] = new Ordering[Todo]{
     |   def compare(x: Todo, y: Todo): Int = {
     |     if(x.status < y.status) -1
     |     else if(x.status < y.status) 1
     |     else 0
     |   }
     | }
myOrdering: Ordering[Todo] = $anon$1@45b1f5bb

scala> seq.sorted(myOrdering)
res3: Seq[Todo] = List(Todo(1,HTML,勉強,1), Todo(5,Java,バックエンド,1), Todo(2,CSS,フロントエンド,2), Todo(4,Scala,研修,2), Todo(3,js,ビュー,3))
```


## 参考文献
---

[Scalaコレクションメソッドメモ](https://www.ne.jp/asahi/hishidama/home/tech/scala/collection/method.html#sorted)

[型クラスをOrderingを用いて説明してみる](https://kmizu.hatenablog.com/entry/2017/05/22/224622)
