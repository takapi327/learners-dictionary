# Either, Try まとめ
---
- [Either](#Either)
  - [Either 値の取得](#値の取得)
  - [foldメソッド](#fold)
  - [Try](#Try)
  - [toEither,toOptionメソッド](#toEithertoOption)
- [参考文献](#参考文献)

## Either
---

[Either](https://github.com/scala/scala/blob/2.13.x/src/library/scala/util/Either.scala#L120)は、Either[A, B]RightとLeftの2つの値を持ちA[Left]またはB[Right]を返すことができる型です。
Right: 正常な値
Left:  エラー値

Eitherは通常Either[(エラー値), (正常な値)]の形で使われることが多く、データ処理が成功した場合はその結果を用いて引き続きの処理を行い、エラーの場合は何もせず次のコードにエラーだけを伝えたい場合などに便利に使用することができます。
例えばログイン機能などで便利に使えるみたいです。まだログイン機能をやっていないので実装内容はわかりませんが下記のイメージかな〜と思っています。

```scala
/*****
UserのIdとPasswordを渡してあげて、
ログイン成功時はRightのUser情報を返し、
失敗時はLeftのエラー文を返す感じかな
*****/

def signup(user: User.Id, pass: User.Password): [Either[String, User] {
  // 処理内容
}

```

### Eitherのインスタンス作成初期化
初期化したい型をしたいしてそれにあった値を入れてあげればインスタンス化は簡単にできる。

```scala
// Rightを指定してInt型で初期化
scala> val right: Either[String, Int] = Right(123)
right: Either[String,Int] = Right(123)

// Leftを指定してString型で初期化
scala> val left: Either[String, Int] = Left("abc")
left: Either[String,Int] = Left(abc)
```

## Either 値の取得
---

Eitherから値を取り出すには、left, rightの値に対して他のメソッド同様にget,getOrElse,map, flatMapなどを用いることで取得が可能です。例えば、Either.right map { ... }とすると、値の内容がRight型の場合はmap内の関数を適用し、Leftの型の場合はmapの処理を無視してLeftの内容（この場合はエラー情報を）をそのまま返す。

### [get](https://github.com/scala/scala/blob/2.13.x/src/library/scala/util/Either.scala#L535)

```scala
// leftに値を入れて初期化
scala> val either: Either[String,Int] = Left("error")
either: Either[String,Int] = Left(error)

// leftに対してget
scala> either.left.get
res4: String = error
```

下記でRightにも値を入れて取得しようとしたらエラーになった。
初期化しているので元々入れてるものも初期化してなくなってるっぽい？
ということは、Eitherは2つの値を持つことはできるけどその値両方に値を保存しておくことはできないってことがわかった。
そもそも最初にA[Left]またはB[Right]]を返すことができる型って自分で書いてましたね。

```scala
scala> val either: Either[String,Int] = Left("error")
either: Either[String,Int] = Left(error)

scala> val either: Either[String,Int] = Right(5)
either: Either[String,Int] = Right(5)

scala> either.left.get
java.util.NoSuchElementException: Either.left.get on Right
  at scala.util.Either$LeftProjection.get(Either.scala:496)
  ... 36 elided
```

まあいつも通りgetで取得しようとすると上記のように値がなかった場合に、例外をはいてしまうのでgetを使うなら値が確実にあると保証できるときもしくは、getOrElseを使うのがいいですね。

### [getOrElse](https://github.com/scala/scala/blob/2.13.x/src/library/scala/util/Either.scala#L279)

```scala
scala>  val either: Either[String,Int] = Left("error")
either: Either[String,Int] = Left(error)

// 値はあるが1が返される
scala> either.getOrElse("1")
res7: Any = 1

scala> val either: Either[String,Int] = Right(5)
either: Either[String,Int] = Right(5)

// 値があるのでその値が返される
scala> either.getOrElse("1")
res8: Any = 5
```
getOrElseは本来なら値がなかった場合に引数で渡した値を返すのだが、Eitherの場合は違っておりRightに値が入っている場合にはその値を返すのは他のメソッドのgetOrElseと同じ。
しかしLeftに値が入っていたとしても値がないと見なされて引数の値が返される。
この結果と[Github](https://github.com/scala/scala/blob/2.13.x/src/library/scala/util/Either.scala#L279)を見るにgetOrElseはRightに対してのみ処理を行っていることがわかる。
シンプルにleftに対して使用すればgetと同じようにLeftの値を返す。

```scala
scala> val either: Either[String,Int] = Left("five")
either: Either[String,Int] = Left(five)

// 値があるのでその値
scala> either.left.getOrElse("1")
res1: String = five

scala> val either: Either[String,Int] = Right(5)
either: Either[String,Int] = Right(5)

// 値がないので引数の値
scala> either.left.getOrElse("1")
res0: String = 1
```

### match

パターンマッチは他のメソッド同様に使うことができる。
```scala
scala> either match {
     | case Left(str)  => println(s"${str}だから値がないよ")
     | case Right(int) => println(s"入っている値は${int}だよ")
     | }
errorだから値がないよ
```

### [map](https://github.com/scala/scala/blob/2.13.x/src/library/scala/util/Either.scala#L381)

mapメソッドもgetOrElseと同様に、Rightの値に対してのみ処理を行います。
```scala
// 処理が起こらない
scala> either.map{x => x + 5}
res4: scala.util.Either[String,Int] = Left(five)

scala> val either: Either[String,Int] = Right(5)
either: Either[String,Int] = Right(5)

// Rightに値があるので処理が動く
scala> either.map{x => x + 5}
res5: scala.util.Either[String,Int] = Right(10)
```

mapもLeftを措定して処理を行えば、使用することができます。

```scala
scala> val either: Either[String,Int] = Left("error")
either: Either[String,Int] = Left(error)

// Leftを指定しているので処理が動く
scala> either.left.map{x => s"Leftなので$x"}
res8: scala.util.Either[String,Int] = Left(Leftなのでerror)
```

## foldメソッド
---

[foldメソッド](https://github.com/scala/scala/blob/2.13.x/src/library/scala/util/Either.scala#L188)はScalaで下記のように定義されている。
foldはLeft、Rightで分けて処理を各々実装するようなイメージ。

```scala
def fold[C](fa: A => C, fb: B => C): C = this match {
  case Right(b) => fb(b)
  case Left(a)  => fa(a)
}
```

下記で実際に試してみると、Right(5)の場合v  => v * 2で２倍する処理を行いLeft(5)の場合にはex => "error"に変換している。
なのでfoldは、まずmatch式でRightかLeftで分けて
分かれた方によって引数に渡した処理を行って結果を返すメソッドとなっている。
他にもいいやり方があるかもですが、実装通りにやるとこんな感じかなと。

```scala
// 処理が成功の場合 
scala> val either: Either[String,Int] = Right(5)
either: Either[String,Int] = Right(5)

scala> either.fold(
    |    ex => "error",
    |    v  => v * 2
    | ])
res49: Any = 10

// 例外処理の場合
scala> val either: Either[String,Int] = Left("5")
either: Either[String,Int] = Left(5)

scala> either.fold(
    |    ex => "error",
    |    v  => v * 2
    |  )
res50: Any = "error"
```

## [Try](https://github.com/scala/scala/blob/2.13.x/src/library/scala/util/Try.scala)
---

[Try](https://github.com/scala/scala/blob/2.13.x/src/library/scala/util/Try.scala#L64)はOptionやEither同様、
処理の実行結果を表す型で、成功時にはSuccess、失敗時にはFailureを返す処理を行う。

```scala
// Tryをimportして使えるようにする
scala> import scala.util.Try
import scala.util.Try

scala> val seq: Seq[String] = Seq("apple","orange","lemon")
seq: Seq[String] = List(apple, orange, lemon)

// 値があるのでSuccessとして処理
scala> val fruit:Try[String] = Try(seq(1))
fruit: scala.util.Try[String] = Success(orange)

// 例外が発生する場合はFailureとして処理
scala> val fruit2:Try[String] = Try(seq(5))
fruit2: scala.util.Try[String] = Failure(java.lang.IndexOutOfBoundsException: 5)
```

foreachを使えば、Successの時のみ実行したい関数を指定でき、Failuerの場合は処理を返さない。
上記とは違いFiluerの時にのみ処理を実行したい場合には、failed.foreachを使えば指定できます。

```scala
// 処理あり
scala> Try(seq(1)).foreach(println)
orange

// 処理なし
scala> Try(seq(5)).foreach(println)

// Filuer時のみ処理あり
scala> Try(seq(5)).failed.foreach(println)
java.lang.IndexOutOfBoundsException: 5
```
Seqに対しても処理ができる。

```scala
scala> val seq: Seq[Int] = Seq(1,2,3,4,5)
seq: Seq[Int] = List(1, 2, 3, 4, 5)

scala> for {
     |   s1 <- Try(seq(0))
     |   s2 <- Try(seq(1))
     |   s3 <- Try(seq(2))
     |   s4 <- Try(seq(3))
     |   s5 <- Try(seq(4))
     | } yield {
     |   s1 + s2 + s3 + s4 + s5
     | }
res20: scala.util.Try[Int] = Success(15)
```

Successは配列を受け取ることもできる。

```scala
scala> val seq: Seq[Seq[Int]] = Seq(Seq(1,2),Seq(3,4),Seq(5,6))
seq: Seq[Seq[Int]] = List(List(1, 2), List(3, 4), List(5, 6))

scala> for {
     |   s1 <- Try(seq(0))
     |   s2 <- Try(seq(1))
     |   s3 <- Try(seq(2))
     | } yield {
     |   s1 ++ s2 ++ s3
     | }
res23: scala.util.Try[Seq[Int]] = Success(List(1, 2, 3, 4, 5, 6))
```

## toEither,toOptionメソッド
---
toEither,toOptionは両方ともTryの型を変換することができるメソッドです。

### toEither

[toEitherメソッド](https://github.com/scala/scala/blob/2.13.x/src/library/scala/util/Try.scala#L181)は、Tryを文字通りEither型に変換することができるメソッドです。
```scala
def toEither: Either[Throwable, T]
```

TryがSuccessかFailureによって処理をRightかLeftにいれる動きをする。
Successの場合T, Failureの場合Tryが持っているThrowable.getMessageの型を渡してあげている。

```scala
import scala.util.Try

// Successの場合
scala> val tryInt = Try(1)
tryInt: scala.util.Try[Int] = Success(1)

// Rightに値をいれる
scala> val either = tryInt.toEither
either: scala.util.Either[Throwable,Int] = Right(1)

// Failureの場合
scala> val tryInt = Try(throw new Exception("Error!"))
tryInt: scala.util.Try[Nothing] = Failure(java.lang.Exception: Error!)

// Leftに値をいれる
scala> val either = tryInt.toEither
either: scala.util.Either[Throwable,Nothing] = Left(java.lang.Exception: Error!)
```
上記の処理を明示的にmatch式を使ってみるとまかりやすい。
matchの場合はgetMessageでThrowableの文字通り文章だけを取り出しているので結果は文字列のみが返されている。

```scala
import scala.util.{Try, Success, Failure}

// Successの場合
scala> val tryInt = Try(1)
tryInt: scala.util.Try[Int] = Success(1)

// Rightに値をいれる
scala> val either: Either[String, Int] =
     |   tryInt match {
     |     case Success(i) => Right(i)
     |     case Failure(e) => Left(e.getMessage)
     |   }
either: Either[String,Int] = Right(1)

// Failureの場合
scala> val tryInt = Try(throw new Exception("Error!"))
tryInt: scala.util.Try[Nothing] = Failure(java.lang.Exception: Error!)

// Leftに値をいれる
scala> val either: Either[String, Int] =
     |   tryInt match {
     |     case Success(i) => Right(i)
     |     case Failure(e) => Left(e.getMessage)
     |   }
either: Either[String,Int] = Left(Error!)
```

### toOption

[toOptionメソッド](https://github.com/scala/scala/blob/2.13.x/src/library/scala/util/Try.scala#L159)は、Tryの処理結果を文字通りOption型に変換することができるメソッドです。
```scala
def toOption: Option[T]
```
toEitherがTryのSuccessかFailureで処理を分けていたのに対して、toOptionはTryのSuccessに値があるかどうかで判断して処理を行っている。
```scala
// Successの場合
scala> val tryInt = Try(5)
tryInt: scala.util.Try[Int] = Success(5)

// Someに包まれて返す
scala> tryInt.toOption
res7: Option[Int] = Some(5)

// Failureの場合
scala> val tryInt = Try(throw new Exception("Error!"))
tryInt: scala.util.Try[Nothing] = Failure(java.lang.Exception: Error!)

// Failureに値があってもNoneを返す
scala> tryInt.toOption
res8: Option[Nothing] = None
```
 ただ型がOption[Nothing]ということはFailureで判断してそうな気が...

## 参考文献
---

[Either Github](https://github.com/scala/scala/blob/2.13.x/src/library/scala/util/Either.scala)

[ScalaのOptionとEitherで例外処理を行う方法](https://blog.shibayu36.org/entry/2015/08/31/103000)

[Try](https://www.scala-lang.org/api/current/scala/util/Try.html)

[Scala研修テキスト](https://scala-text.github.io/scala_text/error-handling.html)
