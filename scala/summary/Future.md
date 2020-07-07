# Future まとめ

## 目次

- [並行プログラミング Future](#Future)
    - [Futureとは](#Futureとは)
        - [概要](#概要)
        - [Future](#Future)
        - [インスタンス](#インスタンス)
    - [ExcecutionContext](#ExcecutionContext)
        - [実装例](#実装例)
    - [Futureメソッドの種類](#Futureメソッドの種類)
        - [コールバック](#コールバック)
            - [onComplete メソッド](#onCompleteメソッド)
        - [map,flatmap](#map,flatmap)
    - [例外処理](#例外処理)
        - [recover,recoverWithメソッド](#recover,recoverWithメソッド) 
- [参考文献](#参考文献)


## 並行プログラミング Future
## Futureとは
### 概要
Future は並列に実行される複数の演算を取り扱うのに便利な方法を提供するものです。
大まかな考え方はシンプルなもので、Future はまだ存在しない計算結果に対するプレースホルダのようなものです。
簡単に説明すると、Future[A] は 「未来に存在する A という値」という文脈を持っています。つまり将来的にAになりうる」ものを表現することができるということです。

### Future
Future は概要で述べたとおり、ある時点において利用可能となる可能性のある値[A]を保持するオブジェクトだ。 この値は、なんらかの計算結果であることが多い。 
その計算が例外とともに失敗する可能性があるため、Future は計算が例外を投げる場合を想定して例外を保持することもできる。
- Scalaで非同期処理を扱うためのもの
- 処理をブロックすることなく、結果の値を処理、合成できる
- 非同期で行われる処理が完了すると成功または失敗が値で表現される
- Future には 1回だけ代入することができるという重要な特性がある。
- 一度 Future オブジェクトが値もしくは例外を持つと、実質不変となり、それが上書きされることは絶対に無い。

Futureを使う方法は、`scala.concurrent`のパッケージをimportすれば使えるようになる。

## ExcecutionContext
ExecutionContextとは簡単に説明するといい感じに非同期に実行してくれる仕組みであり、ExecutionContextの[executeメソッド](https://github.com/scala/scala/blob/2.12.x/src/library/scala/concurrent/ExecutionContext.scala#L78)は、Runnableを受け取り適当なタイミング(ExecutionContextの実装)によって実行を行う。
`scala.concurrent.ExecutionContext.Implicits.global` は scalaが標準で提供しているExecutionContextだと思えば良い。

ExecutionContextの処理を画像でみてみるとわかりやすい。

<img width="385" alt="スクリーンショット 2020-05-14 15 06 42" src="https://user-images.githubusercontent.com/57429437/81898909-95712300-95f4-11ea-8419-ea128c1b3cec.png">

> 例えば10個の重いタスクがあったとして、それぞれのタスクに対し new Thread & start (スレッド立ち上げ) して処理した場合は当然次のように10個のスレッドが立ち上がる。
> しかし、この実装は以下のような問題点がある
>
> ・タスク数分スレッドを立ち上げるためメモリ/CPU資源の無駄になる
> ・しかも暇しているスレッドがいる

<img width="307" alt="スクリーンショット 2020-05-14 15 06 54" src="https://user-images.githubusercontent.com/57429437/81899166-2b0cb280-95f5-11ea-97f7-f2cb0d1f8bb3.png">

> このようにタスク(Runnableといったほうが適切か)を「いい感じ((ExecutionContextの実装による)」にスレッドに分配するのがExecutionContextの役目だ。
> 一般には「一定数を最大数とするスレッドプールを持っており、空いてるスレッドを利用してRunnableを処理してくれる」と考えればいいのではないだろうか。

### 実装例
[ExecutionContext実装例](https://github.com/takapi327/scala-play-app/blob/feature/2020-05-SPA-004-Create-User-Controller/app/controllers/User.scala#L21)

下記はコントローラーの処理を記述している箇所であり、`implicit ec: ExecutionContext`が定義されている。
簡単に説明をすると、これはScalaで非同期に処理を実行するための機能を暗黙的に個々のメソッドに渡すような処理をしています。
定義をして直接使用はしませんが、Repositoryのメソッド内で実行される処理の内部で必要となってくる。

```scala
// アプリ名/app//controllers/コントローラー名
// Contorollerでの処理
class UserController @Inject()(
  userRepo: UserRepository,
  cc: MessagesControllerComponents
)(implicit ec: ExecutionContext) 
  extends MessagesAbstractController(cc){
// この記述があっている保証もないしもっと良い定義の方法があるかもしれない...
```

この記述を行うことで暗黙的なExecutionContextを得るために何も考えず、`scala.concurrent.ExecutionContext.Implicits.global`をimportするということがなくなる。

> アプリケーション開発者は実行のポリシーを設定する場所を慎重に検討する必要がある。
> 理想的には、アプリケーションごと、またはコードの論理的に関連するセクションごとにどの ExecutionContext を使用するかを決定する。
> すなわち、scala.concurrent.ExecutionContext.Implicits.global の import をハードコーディングするのは避けるべきである。
> 推奨されるアプローチは、(implicit ec: ExecutionContext) を ExecutionContext が必要なメソッドまたはクラスのコンストラクタパラメータに追加することである。
上記はscalaではFutureなどの裏側でExecutionContextが動いており、ExecutionContextの使い方がいまいちだとFuture周りで問題が起きてしまうので、アプリケーションに合ったExecutionContext使いましょうということですね。

下記REPLでの実行結果でもわかるようにFutureをimportするだけではダメで、ちゃんとExecutionContextも定義しないといけないとわかる。
```scala
// Scala -v 2.12.x
scala> import scala.concurrent.Future
import scala.concurrent.Future

scala> Future { 1 + 1 }
<console>:13: error: Cannot find an implicit ExecutionContext. You might pass
an (implicit ec: ExecutionContext) parameter to your method.

The ExecutionContext is used to configure how and on which
thread pools Futures will run, so the specific ExecutionContext
that is selected is important.

If your application does not define an ExecutionContext elsewhere,
consider using Scala's global ExecutionContext by defining
the following:

implicit val ec = ExecutionContext.global
       Future { 1 + 1 }
              ^
```
同じように2.13.x系で実行すると`scala.concurrent.ExecutionContext.global`を使おうみたいな親切なエラーが出るけどさっきの話をみるととりあえず使っとくっていうのはやめた方がいいですね！

```scala
// Scala -v 2.13.x
scala> import scala.concurrent.Future
import scala.concurrent.Future

scala> Future { 1 + 1 }
              ^
       error: Cannot find an implicit ExecutionContext. You might pass
       an (implicit ec: ExecutionContext) parameter to your method.

       The ExecutionContext is used to configure how and on which
       thread pools Futures will run, so the specific ExecutionContext
       that is selected is important.

       If your application does not define an ExecutionContext elsewhere,
       consider using Scala's global ExecutionContext by defining
       the following:

       implicit val ec: scala.concurrent.ExecutionContext = scala.concurrent.ExecutionContext.global
```
これ以上調べていくとキリがないので割愛

## Futureメソッドの種類
### コールバック
コールバックとは、簡単に言うとFuture[A]「未来に存在するAという値」が利用可能となったときに、それを使って何かをする方法を定義するものです。
Futureの性質上Aという値は非同期処理が完了してからでないと処理を行うことができない。これだとせっかく非同期で処理を行ったのに再度処理を別スレッドで行わなければならない。
これだとせっかくFutureで非同期処理している恩恵を感じづらい気がする。
コールバックを定義するとコールバックは、Futureが完了すると非同期に呼び出され、またFuture が既に完了している場合は、コールバックは非同期に実行されるか、もしくは同じスレッドで逐次的に実行されるという特性を持つ。
なので、非同期処理を無駄にすることなく実装を行うことができる。
名前の通り呼び戻して処理を行うって思っておこう。

### onComplete メソッド
コールバックを登録するのでもっとも凡庸的なのは、[onComplete メソッド](https://github.com/scala/scala/blob/2.13.x/src/library/scala/concurrent/Future.scala#L118)みたいです。
```scala
def onComplete[U](f: Try[T] => U)(implicit executor: ExecutionContext): Unit
```
onCompleteメソッドは、Futureが成功すればSuccess[T]型の値に適用され、失敗すればFailure[T]型の値に適用される。
定義通りTry[T]型になって返される。
Try[T]は値を持つ場合はSuccess[T]で、それ以外の場合はFailure[T]で必ず例外を持つものでした。Failure[T]は、何故値が無いのかを説明できるため、Noneよりも多くの情報を持つことができる。同様にTry[T]をEither[Throwable, T]、つまり左値を Throwable に固定した特殊形だと考えることもできる。
実際に定義して使ってみる。

```scala
scala> val sum: Future[Int] = Future {
     |   1 + 1
     | }
sum: scala.concurrent.Future[Int] = Future(<not completed>)

scala> sum onComplete {
     |   case Success(n) => println(n)
     |   case Failure(f) => println("エラーが発生した: " + f.getMessage)
     | }
2 // 処理結果が返される
```
無理やりですが例外処理にするとこんな感じ

```scala
scala> val error = Future {
     |   throw new Exception("Error!")
     | }
error: scala.concurrent.Future[Nothing] = Future(<not completed>)

scala> error onComplete {
     |   case Success(n) => println(n)
     |   case Failure(f) => println("エラーが発生した: " + f.getMessage)
     | }
エラーが発生した: Error! // 処理結果が返される
```

### map,flatmap
onCompleteメソッドは、戻り値がUnitのため、処理の連結させることができません。Futureの処理を連結させたい場合にはmapメソッドやflatMapメソッドを使います。
使い方は各メソッドとさほど変わらない。
### map
mapを使って連結した場合

```scala
scala> val num1: Future[Int] = Future{1 + 1}
num1: scala.concurrent.Future[Int] = Future(<not completed>)

scala> val num2: Future[Int] = Future{2 + 2}
num2: scala.concurrent.Future[Int] = Future(<not completed>)

scala> val num3: Future[Int] = Future{3 + 3}
num3: scala.concurrent.Future[Int] = Future(<not completed>)

scala> num1.map{ n =>
     |   num2.map{ m =>
     |     num3.map{ s =>
     |       n + m + s
     |     }
     |   }
     | }
res14: scala.concurrent.Future[scala.concurrent.Future[scala.concurrent.Future[Int]]] = Future(<not completed>)

scala> println(res14)
Future(Success(Future(Success(Future(Success(12))))))
```
### flatmap
flatmapを使って連結した場合

```scala
scala> num1.flatMap{ n =>
     |   num2.flatMap{ m =>
     |     num3.map{ s =>
     |       n + m + s
     |     }
     |   }
     | }
res16: scala.concurrent.Future[Int] = Future(<not completed>)

scala> println(res16)
Future(Success(12))
```
ここまでくると素直にforを使いましょう。

```scala
scala> for {
     |   n <- num1
     |   m <- num2
     |   s <- num3
     | } yield {
     |   n + m + s
     | }
res18: scala.concurrent.Future[Int] = Future(<not completed>)

scala> println(res18)
Future(Success(12))
```

ただfor式も気をつけないと非同期処理を無駄にしてしまう可能性がある。
下記実装だと処理は約10秒で終わる。
```scala
scala> val num1 = Future { Thread.sleep(100000); 21 + 21 }
num1: scala.concurrent.Future[Int] = Future(<not completed>)

scala> val num2 = Future { Thread.sleep(100000); 23 + 23 }
num2: scala.concurrent.Future[Int] = Future(<not completed>)

scala> for {
     |   x <- num1
     |   y <- num2
     | } yield {
     |   num1 + num2
     | }
<console>:23: error: type mismatch;
 found   : scala.concurrent.Future[Int]
 required: String
         num1 + num2
                ^

scala> for {
     |   x <- num1
     |   y <- num2
     | } yield {
     |   x + y
     | }
res21: scala.concurrent.Future[Int] = Future(<not completed>)

scala> println(res21)
Future(Success(88))
```
下記実装だと20秒もかかってしまう。

```scala
scala> for {
     |   x <- Future { Thread.sleep(10000); 21 + 21 }
     |   y <- Future { Thread.sleep(10000); 23 + 23 }
     | } yield {
     |   x + y
     | }
res35: scala.concurrent.Future[Int] = Future(<not completed>)

scala> println(res35)
Future(<not completed>)

scala> ..20秒経過後

scala> println(res35)
Future(Success(88))
```
以上の結果からfor式を使う際には、Futureの処理をfor式よりも前に定義しておかなければならない。
上記実装をflatMapを使って実装してみるとわかりやすいかもしれない。
簡単にいうと上のFuture処理が終わってから次のFuture処理を行っているからですね。

```scala
val num1 = Future { Thread.sleep(100000); 21 + 21 }

val num2 = Future { Thread.sleep(100000); 23 + 23 }

for {
  x <- num1
  y <- num2
} yield {
  x + y
}
```

## 例外処理
ScalaのFutureは、失敗したFutureを操作する方法として、recover,recoverWithメソッドが存在する。

### recover,recoverWithメソッド
### recover
recoverメソッドは、成功したFutureの結果をそのまま変更せずに渡して、失敗したFutureを成功したFutureに変換することができる。

### recoverWith
recoverWithメソッドはrecoverとよく似ているが、recoverのように値にではなく、Futureに修復するところが違っている。

## 参考文献

[scala.concurrent.Future](https://github.com/scala/scala/blob/2.12.x/src/library/scala/concurrent/Future.scala)

[FUTURE と PROMISE](https://docs.scala-lang.org/ja/overviews/core/futures.html)

[Scala ExecutionContextって何 / Futureはスレッド立ち上げじゃないよ](https://mashi.hatenablog.com/entry/2014/11/24/010417)

[ExcecutionContext](https://github.com/scala/scala/blob/2.12.x/src/library/scala/concurrent/ExecutionContext.scala)

[アプリケーションに合ったExecutionContextを使う](http://tototoshi.hatenablog.com/entry/2015/12/23/154104)

[Future内でThread.sleepはするな](https://mashi.hatenablog.com/entry/2014/12/08/000149)
