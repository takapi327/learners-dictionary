# Seq[T]型　まとめ
---
1.[Seq型とは](#Seq型) 
2.[Seqの要素にアクセス](#Seqの要素にアクセス) 
3.[複数のSeqの連結](#複数のSeqの連結)
4.[map,flatmapメソッド使い方](#mapメソッド使い方)  
5.[match使い方](#match使い方)  
6.[findメソッド使い方](#findメソッド使い方) 
7.[filterメソッド使い方](#filterメソッド使い方) 
8.[collect,collectFirstメソッド使い方](#collect,collectFirstメソッド使い方)
9.[exists,containsメソッド使い方](#exists,containsメソッド使い方) 
10.[foldLeft,foldRightメソッド使い方](#foldLeft,foldRightメソッド使い方) 
11.[reduceメソッド使い方](#reduceメソッド使い方) 
12.[参考文献](#参考文献)  

## *Seq型とは*
---

Seqは、インスタンス（要素）を並べて管理するコレクション、配列またはリスト使う際に役立つ。
ScalaのSeqは以下のように作成できる。

```scala
scala> Seq(1,2,3)
res0: Seq[Int] = List(1, 2, 3)
```
変数にリストを持たせる場合は、下記のようにします。
変数の型を明示しなくても定義できますが、定義したほうが見やすさと型の間違いを防ぐために良いと思う。
```scala
scala> val seqInt: Seq[Int] = Seq(1,2,3)
seqInt: Seq[Int] = List(1, 2, 3)
```

## *Seqの要素にアクセス*
---

上記で作成したSeqにアクセスする方法はいくつかある。

```scala
scala> seqInt(1)
res1: Int = 2
```
scalaの配列は他の言語と同じように0から始まるので、1番目を取得しようとすると数字の2が返される。
また、Seqの先頭要素や末尾要素へのアクセスはheadやlastを使って行うことができる。

### head,headOptionメソッド
```scala
// head
scala> seqInt.head
res2: Int = 1
```
headは、Scalaの[TraversableLike.scala](https://github.com/scala/scala/blob/2.12.x/src/library/scala/collection/TraversableLike.scala#L531)ファイルに定義されているメソッドです。
処理内容は下記のように実装されています。
```scala
def head: A = {
  var result: () => A = () => throw new NoSuchElementException
  breakable {
    for (x <- this) {
      result = () => x
      break
    }
  }
  result()
}
```
先頭の要素をOptionに包んで返す[headOptionメソッド](https://github.com/scala/scala/blob/2.12.x/src/library/scala/collection/TraversableLike.scala#L547)も存在しています。
```scala
// headOption
scala> seqInt.headOption
res4: Option[Int] = Some(1)
```
headと同じTraversableLikeのファイルに記述されていて、
実装内容としてはif文で処理を分けてSomeに包まれたものにheadの処理を行なっているという簡単なものなのでわかりやすいです。

```scala
def headOption: Option[A] = if (isEmpty) None else Some(head)
```
headOptionの処理は、単体で行なっているように見えますが上記をみると最初にheadOptionを行ってからheadの処理を行なっています。そして返ってきた値はSomeに包まれているのでOption型として処理ができるというわけですね！

なんか人に仕事をやらせて成果だけ自分のものにする奴みたいだね...！

### last,lastOptionメソッド
```scala
// last
scala> seqInt.last
res3: Int = 3
```
lastもheadと同じようにScalaの[TraversableLike.scala](https://github.com/scala/scala/blob/2.12.x/src/library/scala/collection/TraversableLike.scala#L565)ファイルに定義されているメソッドです。
処理内容は下記のように実装されています。
```scala
def last: A = {
  var lst = head
  for (x <- this)
    lst = x
  lst
}
```
lastはheadと違って処理が短く簡単になっていますね！だってまたheadの処理を使っているのだから...
lastもheadOptionのように[lastOption](https://github.com/scala/scala/blob/2.12.x/src/library/scala/collection/TraversableLike.scala#L577)というメソッドがあります。
```scala
// lastOption
scala> seqInt.lastOption
res5: Option[Int] = Some(3)
```
下記がlastOption内での処理内容です。
```scala
def lastOption: Option[A] = if (isEmpty) None else Some(last)
```

先頭と最後の要素を省いて要素を取得するinitとtailtというものも存在する。

```scala
// init
scala> seqInt.init
res6: Seq[Int] = List(1, 2)
// tail
scala> seqInt.tail
res7: Seq[Int] = List(2, 3)
```

## *複数のSeqの連結*
---

ScalaでSeqとSeqを連結する方法下記の通り

```scala
scala> val seqInt2 = Seq(4,5,6)
seqInt2: Seq[Int] = List(4, 5, 6)

scala> seqInt ++ seqInt2
res8: Seq[Int] = List(1, 2, 3, 4, 5, 6)
```
他にも先頭に要素を追加する+:などもある。

## *map,flatmapメソッド使い方*
---

### mapメソッド使い方

mapメソッドを調べた結果簡単にいうと、OptionやSeqなどの中に入っている値を個別加工したい時に使う！です。
これでだいぶ難しく考えずに使うことができるはず！僕はそうでしたw

```scala
// _で要素全てに2倍する処理を実行
scala> seqInt.map(_ * 2)
res9: Seq[Int] = List(2, 4, 6)
```
### 実装例

参照: https://github.com/takapi327/education-app/blob/master/app/controllers/Todo.scala#L124

```scala
for {
  // categoryテーブルの値を全て取得
  categoryRepo <- CategoryRepository.getAll()
} yield {
  // Seq[(String, String)]型に変更する処理をmapを使い実行
  val category: Seq[(String, String)] = categoryRepo.map(
    x => (x.id.toString, x.v.name)
  )
}
```
上記の処理はmapを使いcategoryRepoの値をSeqを一旦無視してxに入れている。
そしてSeq[(String, String)]となるように、xの中にあるidとnameのみを取得し返している。
このようにmapは変更したい配列の値を個別に加工して返すことができるメソッドです。

### flatMapメソッド使い方
flatmapはmapとflattenが一つに合わさったメソッドです。
処理内容としては、入れ子構造になっているものを1つにまとめて返すことができます。

<img width="765" alt="スクリーンショット 2020-05-05 12 36 14" src="https://user-images.githubusercontent.com/57429437/81033078-17fb3380-8ecd-11ea-9072-d9e954ec0461.png">

a1がSeq(1,2,3)、a2がSeq(4,5,6)、 a3がSeq(7,8,9)とする。
それがSeq(a1,a2,a3)になっているイメージ

下記　flatMap(a =>　の部分が画像でいうfに該当する。
分解してflatMapでまとめている。

```scala
// 画像のa1~a3までの処理
val seqSeqInt: Seq[Seq[Int]] = Seq(Seq(1,2,3), Seq(4,5,6), Seq(7,8,9))
seqSeqInt: Seq[Seq[Int]] = List(List(1, 2, 3), List(4, 5, 6), List(7, 8, 9))

// 入れ子構造になっていたものをSeq[Int]として返している。
scala> scala> seqSeqInt.flatMap(a => a)
res10: Seq[Int] = List(1, 2, 3, 4, 5, 6, 7, 8, 9)
```

上記の処理をmapとflattenを使い実装した場合、下記のようになる。
```scala
scala> seqSeqInt.map(x => x).flatten
res0: Seq[Int] = List(1, 2, 3, 4, 5, 6, 7, 8, 9)
```

このようにflatMapは、mapとflattenの両方の動きをまとめて行うことができるメソッドだとわかる。

ちなみに上記2つの処理は、forを使って書くこともできる。
```scala
scala> for{
     |   seqInt <- seqSeqInt
     |   int    <- seqInt
     | }yield{
     |   int
     | }
res2: Seq[Int] = List(1, 2, 3, 4, 5, 6, 7, 8, 9)
```
結果が全て同じになっていることがわかると思います。
どちらで書いても同じなのですが、処理をするものが増えれば増えるほどfor文で書く方が見た目もすっきりして良いです。
例えばflatMapやmapでたくさんのものを処理すると入れ子が多くなり醜くなってしまいます。

```scala
// 極端に書きます
x.flatMap(
  a => a.map(
    b => b.map(
      c => c.map(
        d => d.map(
          e => e.map(
            f => f.map(
              ........
            )
          )
        )
      )
    )
  )
 )
```
すごく長くなってどこでどんな処理をしているのかがわかりにくくなってしまいます。
これをforで書いた場合

```scala
for {
  b <- a
  c <- b
  d <- c
  e <- d
  f <- e
  ......
}
```
このようにまとめて書くことができどこで何をしているのかがわかりやすいです。
なので、大規模なものを扱う場合にはforを使ってあげるのが良いと思います。
僕は全体で一気にまとめるものと、個別に処理したいもので使い分けるのが良さそうなイメージを持っています。
mapの実装例で使ったようにforで処理したものをSeq[(String, String)]のように型変換する場合には、両方使って実装した方が良い感じがする。

## *match使い方*
---
match式は、値に応じて処理を分岐させる動きをする。

```scala
// 引数に渡した値に応じて処理を分ける
scala> def seqInt(x: Any) = 
     |  x match {
     |    case i: Seq[Int] => true  // 引数がSeq[Int]型ならtrue
     |    case _           => false // それ以外はfalse
     |  }
seqInt: (x: Seq[Int])Boolean

scala> seqInt(Seq(1,2,3))
res1: Boolean = true

scala> seqInt(1)
res2: Boolean = false
```

Seqに対して直接matchを使うこともできる

```scala
scala> Seq(1,2,3) match {
     |   case Seq(_, 2, _) => println("Found it")  // 2番目の値が2であった場合の処理
     |   case _            => println("Not found") // それ以外の処理
     | }
Found it
```
matchは必ずSeqで使わないといけないわけではなく、今回はSeqの説明なのでSeqに拘っています。
他のメソッドで随時実装例を踏まえてまとめていくつもりです。

## *findメソッド使い方*
---
対象コレクションのうち、条件を満たす最初の要素をSomeに入れて返します。無い場合はNoneを返します。 引数にはBooleanを返す関数を渡します。

<img width="426" alt="スクリーンショット 2020-05-05 17 15 51" src="https://user-images.githubusercontent.com/57429437/81046833-2ad52e80-8ef4-11ea-91ea-35e9c81f1610.png">

値がなければNoneを返す

<img width="410" alt="スクリーンショット 2020-05-05 17 16 00" src="https://user-images.githubusercontent.com/57429437/81046849-30327900-8ef4-11ea-8e71-7bde66f17e65.png">

```scala
scala> val findSeq = Seq(1,2,3)  // Seq(a1,a2,a3)
findSeq: Seq[Int] = List(1, 2, 3)

// mapと同じようにSeqを無視して値だけをnumに入れています
scala> findSeq.find(num => num == 2)  // numが2と同じものをSomeに包んで返す
res7: Option[Int] = Some(2)

scala> findSeq.find(num => num == 5)  // numが5と同じものがないので、Noneを返す
res8: Option[Int] = None
```

### 実装例
TodoテーブルのcategoryIdとCategoryテーブルのIdを紐付ける処理をmapとfindを使い実装
```scala
// Todoとcategoryの値を全て取得(名前の通り両方Seq型)
for {
  todoSeq  <- TodoRepository.getAll()
  caSeq    <- CategoryRepository.getAll()
} yield {
  // mapを使いSeqを無視して値だけ取得
  val r = todoSeq.map(todo => {
    // findを使いSeqを無視してcaSeqの値を取得IdとtodoのcategoryIdと比較、一致したものだけを返す
    todo -> caSeq.find(ca => ca.id == todo.v.categoryId)
    // ->で挟まれたものでMap(key -> value)を作ることができる。*Mapまとめで説明
  })
}
```
## *filterメソッド使い方*
---

対象コレクションのうち、条件を満たす要素だけで構成されたコレクションを返します。
一つも条件を満たす要素が無い場合は空のコレクションが返されます。

```scala
scala> val filterSeq = Seq(1,2,3)
filterSeq: Seq[Int] = List(1, 2, 3)

// Seqを無視して値に対して処理を行い結果をSeqに戻して返す
scala> filterSeq.filter(num => num > 1)
res10: Seq[Int] = List(2, 3)

scala> filterSeq.filter(num => num > 5)
res11: Seq[Int] = List()
```
### 実装例

参照: https://github.com/takapi327/education-app/blob/master/app/lib/persistence/Todo.scala#L34

検索機能などで使うことができる。
```scala
// todoアプリで実装したあいまい検索機能の例
def filterByTitle(input: lib.model.Todo.SearchValue): Future[Seq[EntityEmbeddedId]] =
  RunDBAction(TodoTable) { _
    .filter(_.title like s"%${input.title}%")
    .result
}
//参考までに
// lib.model.Todo.SearchValueは、検索フォームに入力した値がくる
// RunDBAction(TodoTable, "slave") は、TodoTableのデータベースに対してアクセスする
// .filter(_.title like s"%${input.title}%")は、like句を使いあいまい検索

//上記の動きとしては全然違うけど、ざっくり雰囲気で書くとこんな感じかなw(知らんけど)
scala> def filterBySeq(input: String): Seq[String] = {
     |   Seq("html", "css", "js")
     |     .filter(st => st == input)
     | }
filterByTitle: (input: String)Seq[String]

scala> filterBySeq("html")
res13: Seq[String] = List(html)
```

## *collect,collectFirstメソッド使い方*
---

### collectメソッド

[collectメソッド](https://www.ne.jp/asahi/hishidama/home/tech/scala/collection/method.html#collect)は、filterとmapを組み合わせたようなメソッドです。 caseにマッチした要素だけが抽出され、その上で変換された値がコレクションとして返されます。

```scala
// 指定した値だけを任意の文字に変換している。
scala> List(1,2,3).collect{ 
     |   case 1 => "one"
     |   case 2 => "two" 
     | }
res3: List[String] = List(one, two)

// 任意の物だけを指定して取得することも可能。
scala> List("a",1,"b",2).collect{ 
     |   case s:String => s
     | }
res5: List[String] = List(a, b)

// 偶数の値だけを2倍する
scala> val seqInt = Seq(1,2,3,4,5)
seqInt: Seq[Int] = List(1, 2, 3, 4, 5)

scala> seqInt.collect{
     |   case 2 => 2 * 2
     |   case 4 => 4 * 2
     | }
res6: Seq[Int] = List(4, 8)
```

このように任意で指定したものを取得し処理を書くことができる。
しかし3番目のような偶数のものに対して処理を行いたい場合に、このままでは要素が多くなればその文処理を記述しなければいけなくなってしまう。
collectには複雑な処理をガードを使い下記のように処理できる。
```scala
scala> seqInt.collect{
     |   case num if num % 2 == 0 => num * 2
     | }
res8: Seq[Int] = List(4, 8)
```
これで要素が増えても偶数の値全てに対して処理を行うことを1行で書ける。

### collectFirst

[collectFirstメソッド](https://www.ne.jp/asahi/hishidama/home/tech/scala/collection/method.html#collectFirst)は、findとmapを組み合わせたようなもので、 caseにマッチした最初の要素が抽出され、その上で変換された値がOptionに包まれて返されます。

```scala
scala> List(1,2,3).collectFirst{ 
     |   case 2 => "two"
     | }
res11: Option[String] = Some(two)

scala> val seqInt = Seq(1,2,3,4,5)
seqInt: Seq[Int] = List(1, 2, 3, 4, 5)

scala> seqInt.collectFirst{
     |   case 2 => 2 * 2
     |   case 4 => 4 * 2
     | }
res9: Option[Int] = Some(4)

// こちらもガードが使える
scala> seqInt.collectFirst{
     |   case num if num % 2 == 0 => num * 2
     | }
res10: Option[Int] = Some(4)
```
## *exists,containsメソッドの使い方*
---

### exists

[existsメソッド](https://www.ne.jp/asahi/hishidama/home/tech/scala/collection/method.html#exists)は、1つでも条件を満たすものがあればtrueを返し、1つもなければfalseを返すメソッドです。

```scala
// 偶数があるかどうか
scala> List(1,2,3).exists(
     |   n => n % 2 == 0
     | )
res12: Boolean = true

// 1の方が大きい値はあるかどうか
scala> List(1,2,3).exists(
     |   n => n < 1
     | )
res0: Boolean = false
```

### contains

[containsメソッド](https://www.ne.jp/asahi/hishidama/home/tech/scala/collection/method.html#contains)は、containsの引数に指定した値が1つでもあればtrueを返し、1つもなければfalseを返すメソッドです。

```scala
scala> List(1,2,3).contains(2)
res1: Boolean = true
```

## *foldLeft,foldRightメソッド使い方*
---

### foldLeft

[foldLeftメソッド](https://www.ne.jp/asahi/hishidama/home/tech/scala/collection/method.html#foldLeft)は、zと要素（左（先頭）から順番）に演算opを行う。要するに左から順に畳み込み演算を行う 第一引数は初期値第二引数は引数の処理

<img width="406" alt="スクリーンショット 2020-05-07 16 13 52" src="https://user-images.githubusercontent.com/57429437/81367568-97387380-9128-11ea-90e3-1f8ca503193d.png">

```scala
scala> List(1,2,3).foldLeft(0)((z, n) =>
     |   z - n
     | )
res4: Int = -6 // ((0-1)-2)-3

/******
foldLeft は、リストを左から右へ畳み込む高階関数です。
って言われても全然イメージが沸かない...
左から右に向かって処理を順番に行うってことかな？
図の通り実装してみる
******/
scala> val list = List(1,2,3,4,5) // List(a1,a2,a3,a4,a5)
list: List[Int] = List(1, 2, 3, 4, 5)

scala> list.foldLeft(0){(num, x) =>  // 0 == z, num == 0, x == a1,a2,a3...
     |   num + x  // 0 + a1 + a2 + a3...
     | }
res2: Int = 15
```

少し複雑な処理を試してみる。
```scala
// 1から10の数字に対してからのSeqにcaseで分けた処理を返す。
scala> (1 to 10).foldLeft((Seq.empty[Int], Seq.empty[Int], Seq.empty[Int]))((t, n) =>
     |   n % 3 match {
     |     case 0 => (t._1 :+ n, t._2, t._3) // 最初の配列にn(3の倍数を入れる)
     |     case 1 => (t._1, t._2 :+ n, t._3) // 2番目の配列にn(3で割って１余る値を入れる)
     |     case _ => (t._1, t._2, t._3 :+ n) // 最後の配列にn(上記以外の値を入れる)
     |   }
     | )
res2: (Seq[Int], Seq[Int], Seq[Int]) = (List(3, 6, 9),List(1, 4, 7, 10),List(2, 5, 8))
```
foldLeftは引数にからの配列を用意して処理の結果を順に入れる処理も行うことができる。

### foldRight

[foldRightメソッド](https://www.ne.jp/asahi/hishidama/home/tech/scala/collection/method.html#foldRight)は、要素（右（末尾）から順番）とzに演算opを行う。単純にfoldLeftとは逆の処理を行っているという認識で大丈夫なのかな？
2つを並べると、結果が全く違う数字になっているのでわかりやすい。
```scala
// 右から処理
scala> List(1,2,3).foldRight(0)((n, z) => 
     |   n - z
     | )
res3: Int = 2 // 1-(2-(3-0))

//　左から処理
scala> List(1,2,3).foldLeft(0)((z, n) =>
     |   z - n
     | )
res4: Int = -6 // ((0-1)-2)-3
```

## *reduceメソッド使い方*
---

[reduceメソッド](https://www.ne.jp/asahi/hishidama/home/tech/scala/collection/method.html#reduce)は、要素同士を左（先頭）から順に演算する要素が1個しかない場合はその値を返し、 foldLeft, foldRightとは違い初期値が無いため、要素が無い場合は例外が発生する。

```scala
scala> List(1,2,3).reduce((z, n) =>
     |   z + n
     | )
res5: Int = 6

// 上記と同じような結果
scala> List(3,1,4).reduce(_ - _)
res7: Int = -2

//　左から処理
scala> List(3,1,4).reduceLeft(_ - _)
res6: Int = -2

// 右から処理
scala> List(3,1,4).reduceRight(_ - _)
res8: Int = 6
```

reduce == リスト x1, x2, …, xn に対して f(f(…f(f(x1, x2), x3), …), xn) を求める。
fold   == リスト x1, x2, …, xn に対して f(f(…f(f(f(e, x1), x2), x3), …), xn) を求める。eが初期値
foldとの違いは初期値を指定していない点です。foldは初期値を指定し初期値とx1との処理をまず行ってから右に向かって処理をする。
しかしreduceはいきなり要素同士で処理を行うので、要素がからの場合エラーが返っていく。

## *参考文献*
---
[Scalaコレクションメソッド](https://www.ne.jp/asahi/hishidama/home/tech/scala/collection/method.html)

[Scala Seq](https://www.ne.jp/asahi/hishidama/home/tech/scala/collection/seq.html)

[Visual Scala Reference](https://superruzafa.github.io/visual-scala-reference/ja/)

[ScalaのCollectionの使い分け](http://kechanzahorumon.hatenadiary.com/entry/2016/02/11/013338)

[Scala match](https://www.ne.jp/asahi/hishidama/home/tech/scala/match.html)

[学ぼう！ コレクションフレームワーク](https://medium.com/nextbeat-engineering/%E5%AD%A6%E3%81%BC%E3%81%86-%E3%82%B3%E3%83%AC%E3%82%AF%E3%82%B7%E3%83%A7%E3%83%B3%E3%83%95%E3%83%AC%E3%83%BC%E3%83%A0%E3%83%AF%E3%83%BC%E3%82%AF-4b6ffaaf42d5)

[Scalaでリスト処理](http://bach.istc.kobe-u.ac.jp/lect/ProLang/org/scala-list.html)

Scalaスケーラブルプログラミング
(P466,24.5章,シーケンストレイトSeq,IndexedSeq,LinearSeq),(P458,24.3章,Traversableトレイト)
