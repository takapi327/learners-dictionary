# tuple, case class まとめ
---
- [tupleとは](#tupleとは)
- [case classとは](#caseclass)
  - [copyメソッド](#copyメソッド)
  - [equals](#equals)
- [参考文献](#参考文献)

## tupleとは
---
tupleはListと同様にimmutable型だが、Listと違うのは異なる要素を持つことができる。

```scala
scala> val list = List(1,2,3)
list: List[Int] = List(1, 2, 3)

scala> val list = List(1,"1")
list: List[Any] = List(1, 1)
```
Listだと引数が[Any](https://www.ne.jp/asahi/hishidama/home/tech/scala/any.html#h_Any)にオブジェクトの値（内容）が等しいかどうかを返すものになってしまう。

```scala
scala> val tuple = (1,"1")
tuple: (Int, String) = (1,1)
```
tupleだと上記のように整数と文字列の両方を格納できる。
メソッドから複数のオブジェクトを返却するときに便利に使える。

```scala
scala> def sample(a: Int, b: Int): (Int, Int) = {
     |   val sum = a + b
     |   val sub = a - b
     |   (sum, sub)
     | }
sample: (a: Int, b: Int)(Int, Int)

scala> sample(34,66)
res9: (Int, Int) = (100,-32)

scala> val r = sample(34,66)
r: (Int, Int) = (100,-32)

scala> r._1
res10: Int = 100

scala> r._2
res11: Int = -32
```
tupleは要素の取得も(取得したい要素があるtuple._要素の番号)という風に簡単に取得できる。


## case classとは
---

case classはimmutableであり差異は多いが普通のclassと似ている。

#### case class
```scala
// クラスの作成
scala> case class User(
     |   id:   Long,
     |   name: String,
     |   mail: String
     | )
defined class User

// インスタンス化
scala> val user = User(1, "test", "111@222")
user: User = User(1,test,111@222)

// 値の取得
scala> user.name
res0: String = test
```

#### class
```scala
scala> class Cuser(
     | id: Long,
     | name: String,
     | mail: String
     | )
defined class Cuser

scala> val user = new Cuser(1, "test", "111@222")
user: Cuser = Cuser@3febca69
```
case classをインスタンス化する際には、classと違いnewを使う必要がありません。
case class自体がオブジェクトの生成を行うapplyメソッドを保有しているためです。

case classで作成したものの引数は、暗黙のうちにvalとして定義されているので、引数はフィールドとして管理され上記のように引数名を指定して値を取得することが可能になっている。

またcase classは比較を値を参照して行うのではなく、構造を比較して行う。

```scala
// case classの場合はtrue
scala> val user = User(1, "test", "111@222")
user: User = User(1,test,111@222)

scala> val user1 = User(1, "test", "111@222")
user1: User = User(1,test,111@222)

scala> user == user1
res4: Boolean = true

// classの場合はfalse
scala> val user = new Cuser(1, "test", "111@222")
user: Cuser = Cuser@3febca69

scala> val user3 = new Cuser(1, "test", "111@222")
user3: Cuser = Cuser@63bc725b

scala> user == user3
res3: Boolean = false
```

## copyメソッド
---
copyメソッドを使うことで簡単にケースクラスのインスタンスのコピーを作ることができます。

```scala
scala> val user1 = User(1, "test", "111@222")
user1: User = User(1,test,111@222)

scala> val user2 = user1.copy(id = 2, name = "yamada")
user2: User = User(2,yamada,111@222)

scala> user1
res5: User = User(1,test,111@222)

scala> user2
res6: User = User(2,yamada,111@222)
```
copyメソッドはメソッド内で指定した値を指定したものに変更できます。
なので、指定しなかった値に関しては変更を加えずそのまま使っています。
またcopyメソッドはその名の通りコピーをしているだけなので、コピーした元のインスタンスはそのままの状態で残ります。

### 実装例
https://github.com/takapi327/education-app/blob/master/app/controllers/Todo.scala#L277

下記はTodoを更新するときの処理を書いています。

```scala
todo => {
  for {
    oldEntity <- TodoRepository.get(Todo.Id(id))
    Some(newEntity) = oldEntity.map(x => x.map(
      y => {y.copy(
        categoryId = todo.categoryId.map(x => Category.Id(x)),
        title      = todo.title,
        body       = todo.body,
        state      = Todo.Status(todo.state)
      )}
    ))
    _ <- TodoRepository.update(newEntity)
  } yield {
  ......
```
簡単に説明すると更新したいTodoをFormで入力した値に変更しています。
説明をかなり省略しますが、todoにはview側で入力した値が入っています。
更新したいSeqのTodoを取得しmapで個別加工し、todoの値に更新しています。
ただcopyメソッドの特性上コピーしているだけなので、別でupdateの処理をしています。

## equals()
---
equalsは、インスタンス同士を比較して、すべての値が同一であればtrueが返すものです。
classとcase classとの違いで説明した動きと同じものです。

```scala
// case classの場合はtrue
scala> val user = User(1, "test", "111@222")
user: User = User(1,test,111@222)

scala> val user1 = User(1, "test", "111@222")
user1: User = User(1,test,111@222)

scala> user.equals(user1)
res4: Boolean = true

// classの場合はfalse
scala> val user = new Cuser(1, "test", "111@222")
user: Cuser = Cuser@3febca69

scala> val user3 = new Cuser(1, "test", "111@222")
user3: Cuser = Cuser@63bc725b

scala> user.equals(user3)
res3: Boolean = false
```

## *参考文献*
---
[Scala Any](https://www.ne.jp/asahi/hishidama/home/tech/scala/any.html)

[Anyクラス](https://www.scala-lang.org/api/current/scala/Any.html)

[タプル](https://docs.scala-lang.org/ja/tour/tuples.html)

[Scalaタプル](http://www.ne.jp/asahi/hishidama/home/tech/scala/tuple.html)

[ケースクラス](https://docs.scala-lang.org/ja/tour/case-classes.html)

Scalaスケーラブルプログラミング
(P067,3.3章,タプルを使う),(P264,15.1章,ケースクラスとパターンマッチ)
