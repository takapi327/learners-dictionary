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
    val mapTodo     = seqTodo.map(v => v.uid -> v).toMap

    // User情報とTodoの情報をIdで紐付ける
    val userTodo    = seqUser.map(u =>
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
## 参考文献
---
[Scala Map](https://www.ne.jp/asahi/hishidama/home/tech/scala/collection/map.html)

[Scala Standard Library](https://www.scala-lang.org/api/current/scala/collection/immutable/Map.html)

[Scalaの配列(Array)と連想配列(Map)](https://b0npu.hatenablog.com/entry/2016/09/24/202330#%E9%80%A3%E6%83%B3%E9%85%8D%E5%88%97-Map)

[ScalaのgroupByメソッドを使ってみた](http://tatehiro52.blogspot.com/2011/08/scalagroupby.html)

Scalaスケーラブルプログラミング
(P473,24.7章,マップ)
Scala実践入門(P124,コレクションのデータ型)
