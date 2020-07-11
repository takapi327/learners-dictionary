# Map型 まとめ
---
- [連想配列 Map型とは](#連想配列) 
  - [Mapの要素にアクセス](#Mapの要素にアクセス) 
  - [values,mapValuesメソッド使い方](#values,mapValuesメソッド使い方)
  - [keys,filterKeysメソッド使い方](#keys,filterKeysメソッド使い方)  
  - [toMapメソッド使い方](#toMapメソッド使い方)  
  - [groupByメソッド使い方](#groupByメソッド使い方)  
- [参考文献](#参考文献)  

## 連想配列 *Map型とは (scala.collection.immutable.Map)*
---
マップは、キーとなるオブジェクト（文字列やSymbol等）に対し、それに該当する値を保持するコレクションです。
空の連想配列Mapの作り方
```scala
// キーがInt型で値がString型のマップを作成
scala> var emptyMap: Map[Int, String] = Map.empty
emptyMap: Map[Int,String] = Map()

// 新たに代入
scala> emptyMap = Map(1 -> "one")
mutated emptyMap

// valで作成したものには再代入できないのでエラーになる。
scala> emptyMap = Map(1 -> "one)
                ^
       error: reassignment to val
```

値の入ったMapの初期化
```scala
scala> val intMap = Map(
     |   1 -> 100,
     |   2 -> 200,
     |   3 -> 300
     | )
intMap: scala.collection.immutable.Map[Int,Int] = Map(1 -> 100, 2 -> 200, 3 -> 300)
```

Mapは配列も含めた集合を作ることができる
```scala
scala> val seqMap: Map[Int, Seq[String]] = Map(
     |   1 -> Seq("one", "佐藤"),
     |   2 -> Seq("one", "田中"),
     |   3 -> Seq("two", "Test")
     | )
seqMap: Map[Int,Seq[String]] = Map(1 -> List(one, "佐藤"), 2 -> List(one, 田中), 3 -> List(two, Test))

```

## *Mapの要素にアクセス*
---

配列から要素を取得したい場合は、取得したキーを宣言してあげる。
```scala
scala> val one = intMap(1)
one: Int = 100

scala> val name = seqMap(2)
name: Seq[String] = List(one, 田中)
```
Seqなどで説明したget,getOrElseメソッド、要素の追加・削除(+, -)、連結(++)も同じように使用することができる。

## *values,mapValuesメソッド使い方*
---

### valuesメソッド
[valuesメソッド](https://www.ne.jp/asahi/hishidama/home/tech/scala/collection/map.html#values)は、Mapに含まれる値の一覧を全て取得します。
```scala
scala> val intMap = Map(1 -> "one", 2 -> "two", 3 -> "three")
intMap: scala.collection.immutable.Map[Int,String] = Map(1 -> one, 2 -> two, 3 -> three)

scala> intMap.values
res0: Iterable[String] = Iterable(one, two, three)
```
上記で初めて見た[Iterabeuトレイト](https://docs.scala-lang.org/ja/overviews/collections/trait-iterable.html)は、最上位から2番目のトレイトでSeqの上にある奴のようです。
このトレイトの全メソッドは、コレクション内の要素を1つずつ返す抽象メソッド iterator に基づいているようですが、イマイチピンとこない...。

### mapValuesメソッド
[mapValuesメソッド](https://www.ne.jp/asahi/hishidama/home/tech/scala/collection/map.html#mapValues)は、Mapの値を変更して新しいMapを返すメソッドです。

```scala
scala> intMap.mapValues(_ + 2)
// 上記で動くはずなのだが、エラーが出てバージョン2.13.0以降でしか使えないっぽい？
```

## *keys,filterKeysメソッド使い方*
---

### keysメソッド
[keysメソッド](https://www.ne.jp/asahi/hishidama/home/tech/scala/collection/map.html#keys)は、valuesメソッドの文字通りキー版でMapに含まれるキーの一覧を取得する。(こちらもキーのIterableを返すみたい。)

```scala
scala> intMap.keys
res7: Iterable[Int] = Set(1, 2, 3)
```

### filterKeysメソッド
[filterKeysメソッド](https://www.ne.jp/asahi/hishidama/home/tech/scala/collection/map.html#filterKeys)は条件を満たす要素だけのMapを返す。例えば、偶数のキーだけを取得したい場合は下記のようになる。

```scala
scala> intMap.filterKeys(_ % 2 == 0)
// 上記で動くはずなのだが、エラーが出てバージョン2.13.0以降でしか使えないっぽい？
```

## *toMapメソッド使い方*
---
toMapメソッドは、タプル2つのSeqからMapに変換する。要はSeqで囲まれたものが2つ以上存在しているときにしようできるってことかな。
```scala
scala> List((1,2),(3,4)).toMap
res10: scala.collection.immutable.Map[Int,Int] = Map(1 -> 2, 3 -> 4)
```

## *groupByメソッド使い方*
---
groupByメソッドは、指定した条件でグループ分けしてMapを生成する。groupByメソッドはグループに含まれているものでしかグループ分けできない。
```scala
scala> val friuts = Seq(("りんご", 200),("イチゴ", 200),("ぶどう", 300),("なし", 400),("バナナ", 300),("モモ", 400))
friuts: Seq[(String, Int)] = List((りんご,200), (イチゴ,200), (ぶどう,300), (なし,400), (バナナ,300), (モモ,400))

scala> friuts.groupBy(_._2)
res13: scala.collection.immutable.Map[Int,Seq[(String, Int)]] = HashMap(300 -> List((ぶどう,300), (バナナ,300)), 400 -> List((なし,400), (モモ,400)), 200 -> List((りんご,200), (イチゴ,200)))
```
同じMapを作るtoMapと同じような動きをしているように感じるが、比較してみると違いがわかる。
両方Traversableのメソッド

```scala
scala> friuts.map(x => (x._2, x)).toMap
res15: scala.collection.immutable.Map[Int,(String, Int)] = Map(200 -> (イチゴ,200), 300 -> (バナナ,300), 400 -> (モモ,400))
```
toMapで作成したMapは、キーとバリューが1組ずつになっており、最後に該当したバリューを返しているのがわかる。

[groupByメソッド](https://github.com/scala/scala/blob/2.12.x/src/library/scala/collection/TraversableLike.scala#L453)
```scala
def groupBy[K](f: A => K): immutable.Map[K, Repr] = {
  val m = mutable.Map.empty[K, Builder[A, Repr]]
  for (elem <- this) {
    val key = f(elem)
    val bldr = m.getOrElseUpdate(key, newBuilder)
    bldr += elem
  }
  val b = immutable.Map.newBuilder[K, Repr]
  for ((k, v) <- m)
    b += ((k, v.result))

  b.result
}
```
[toMapメソッド](https://github.com/scala/scala/blob/2.12.x/src/library/scala/collection/TraversableOnce.scala#L352)
```scala
def toMap[T, U](implicit ev: A <:< (T, U)): immutable.Map[T, U] = {
  val b = immutable.Map.newBuilder[T, U]
  b ++= seq.asInstanceOf[TraversableOnce[(T, U)]]
  b.result()
}
```

### 実装例
```scala
object User extends App {

  // Userの型
  case class User(
    id:   Option[Int],
    name: String
  )
  
  // Todoの型
  case class Todo(
    uid:  Int,
    todo: String,
  )

    // User情報の配列を作成
    val seqUser = Seq(
      User(Some(1), "田中"),
      User(Some(2), "山田"),
      User(Some(3), "佐々木"),
      User(Some(4), "石田"),
      User(Some(5), "鈴木")
    )

    // Todo情報の配列を作成
    val seqTodo = Seq(
      Todo(1, "勉強"),
      Todo(1, "遊び"),
      Todo(1, "食事"),
      Todo(2, "勉強"),
      Todo(3, "遊び"),
      Todo(4, "学校"),
      Todo(4, "遊び"),
      Todo(2, "遊び"),
      Todo(5, "食事"),
      Todo(5, "勉強"),
      Todo(3, "勉強")
    )

    // toMapメソッドを使用してTodoの配列をuidをキーとしてMap型に変換
    val mapTodo = seqTodo.map(v => v.uid -> v).toMap

    // User情報とTodoの情報をIdで紐付ける
    val userTodo = seqUser.map(u =>
        u.id match {
          case Some(uid) => (u, mapTodo.get(uid))
          case None      => (u, None)
        } 
    )

    // 上記と同じ処理
    val groupByTodo = seqTodo.groupBy(_.uid)
    val userTodo2   = seqUser.map(u =>
        u.id match {
          case Some(uid) => (u, groupByTodo.get(uid))
          case None      => (u, None)
        } 
    )

    println(groupByTodo)
    println("-----------------")
    println(mapTodo)
    println("-----------------")
    println(userTodo)
    println("-----------------")
    println(userTodo2)
    println("-----------------")
}
```

上記は引く数のUserとそのUserが所有しているTodoの一覧を紐付ける処理を行っています。
まず配列と配列をお互いの持っている値を紐付けて、1つの配列にしたいとします。
UserのIdの値とTodoのuidの値が同じものが、そのUserが持っているTodoとわかるように設定していきます。
まずcase classに関しては、後ほど勉強して行くと思うので、今回はUserやTodoの入れ物を作るぐらいの感覚で大丈夫です。
```scala
val mapTodo = seqTodo.map(v => v.uid -> v).toMap
```
それではまずSeqの配列をマップ型に変更するtoMapメソッドを使っていきます。
Map型はキーと値を保持する配列でしたね。今回はTodoをuidをキーとして取り出したりできるようにしたいので、まずmapメソッドを使用してuidとそれに紐づく値を2つ持ったSeq[(Int, Todo)]に型を変換します。
REPLで確認してみると下記のようになるはずです。
(case classとかもREPLで設定する必要があります)
```
scala> val mapTodo = seqTodo.map(v => v.uid -> v)
mapTodo: Seq[(Int, Todo)] = List((1,Todo(1,勉強)), (1,Todo(1,遊び)), (1,Todo(1,食事)), (2,Todo(2,勉強)), (3,Todo(3,遊び)), (4,Todo(4,学校)), (4,Todo(4,遊び)), (2,Todo(2,遊び)), (5,Todo(5,食事)), (5,Todo(5,勉強)), (3,Todo(3,勉強)))
```
これに対してtoMapメソッドを使用すると下記のようになります。
```scala
scala> mapTodo.toMap
res1: scala.collection.immutable.Map[Int,Todo] = Map(5 -> Todo(5,勉強), 1 -> Todo(1,食事), 2 -> Todo(2,遊び), 3 -> Todo(3,勉強), 4 -> Todo(4,遊び))
```
ではこの作成したTodoのMap型配列とUserの配列を結び付けていきます。

```
val userTodo = seqUser.map(u =>
  u.id match {
    case Some(uid) => (u, mapTodo.get(uid))
    case None      => (u, None)
  } 
)
```
上記をREPLで実行すると下記のようになります。
```
userTodo: Seq[(User, Option[Todo])] = List((User(Some(1),田中),Some(Todo(1,食事))), (User(Some(2),山田),Some(Todo(2,遊び))), (User(Some(3),佐々木),Some(Todo(3,勉強))), (User(Some(4),石田),Some(Todo(4,遊び))), (User(Some(5),鈴木),Some(Todo(5,勉強))))
```
今回行った処理は、Userの配列をmapメソッドを使用して個別加工しUserにIdが存在したらmatch文で条件分岐を行っています。
match文も後ほど学習すると思います。今回はIf文みたいな感じと思っていてください。
条件分岐でIdがあった場合には、mapで切り出したUser情報と先ほど作ったMap型のTodoをgetを使いuidと同じキー値を取得しています。
そしてmapは個別加工しているだけなので、戻り値はSeq[(User, Option[Todo])]型とSeqになって返されます。
ちなみにgetを使わなくても取得は出来ますので、色々試して見てください。

次は同じ処理をgroupByメソッドを使って実装した場合を見てみます。
```
scala> val groupByTodo = seqTodo.groupBy(_.uid)
groupByTodo: scala.collection.immutable.Map[Int,Seq[Todo]] = Map(5 -> List(Todo(5,食事), Todo(5,勉強)), 1 -> List(Todo(1,勉強), Todo(1,遊び), Todo(1,食事)), 2 -> List(Todo(2,勉強), Todo(2,遊び)), 3 -> List(Todo(3,遊び), Todo(3,勉強)), 4 -> List(Todo(4,学校), Todo(4,遊び)))
```
groupByメソッドだとキーに対応した配列の値が返されています。
この配列を同じようにUserと結びつけると下記のようになります。
```
val userTodo2   = seqUser.map(u =>
  u.id match {
    case Some(uid) => (u, groupByTodo.get(uid))
    case None      => (u, None)
  } 
)

userTodo2: Seq[(User, Option[Seq[Todo]])] = List((User(Some(1),田中),Some(List(Todo(1,勉強), Todo(1,遊び), Todo(1,食事)))), (User(Some(2),山田),Some(List(Todo(2,勉強), Todo(2,遊び)))), (User(Some(3),佐々木),Some(List(Todo(3,遊び), Todo(3,勉強)))), (User(Some(4),石田),Some(List(Todo(4,学校), Todo(4,遊び)))), (User(Some(5),鈴木),Some(List(Todo(5,食事), Todo(5,勉強)))))
```
先ほどのtoMapと違って該当するものを全てを取得できているはずです。
まあこんな感じで使ったりします。
この実装自体改善点がたくさんあるので、自分で改造して試してみると良いかもしれません。

## 参考文献
---
[Scala Map](https://www.ne.jp/asahi/hishidama/home/tech/scala/collection/map.html)

[Scala Standard Library](https://www.scala-lang.org/api/current/scala/collection/immutable/Map.html)

[Scalaの配列(Array)と連想配列(Map)](https://b0npu.hatenablog.com/entry/2016/09/24/202330#%E9%80%A3%E6%83%B3%E9%85%8D%E5%88%97-Map)

[ScalaのgroupByメソッドを使ってみた](http://tatehiro52.blogspot.com/2011/08/scalagroupby.html)

Scalaスケーラブルプログラミング
(P473,24.7章,マップ)
Scala実践入門(P124,コレクションのデータ型)
