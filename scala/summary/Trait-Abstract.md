# trait, abstract class まとめ
---
- [trait](#trait)
- [abstract](#abstract)
- [override](#override)
- [final,private,sealed](#final,private,sealed)
- [参考文献](#参考文献)

## trait
---
traitの定義は、traitキーワードを使うことを除けば、class定義とよく似ている。
traitの実装は下記のようにできる。
```scala
scala> trait Subject
defined trait Subject
```

traitはclassのように引数をとることができない。
```scala
// classの場合
scala> class Subject(
     |   name: String
     | )
defined class Subject

// traitの場合
scala> trait Subject(name: String)
<console>:1: error: traits or objects may not have parameters
       trait Subject(name: String)
                    ^
```

もしtraitに引数を持たせたい場合は、下記のように実装する必要がある。
```scala
scala> trait Subject {
     |   val name: String
     | }
defined trait Subject

scala> val mouth = new Subject {val name = "mouth"}
mouth: Subject = $anon$1@25da1aee

scala> mouth.name
res7: String = mouth
```
これで初期化ができたが、これで定義するなら他のものを使った方が良さそうな気がする...

traitはメソッドも下記のように定義することができる。
```scala
scala> trait Subject {
     |   def name(): Unit = {
     |   }
     | }
defined trait Subject
```
ただこれでは動きとして何もない。
このtraitをミックスインすることで定義したメソッドを使用することができる。

### traitのミックスイン
ミックスインとは、 複数のトレイトを使ってクラスやトレイトを定義する ことで、
このことを ミックスイン合成 なんて言うこともあるらしい。
Javaのインタフェースで言うと、 複数のインタフェースを実装してクラスを定義する みたいな感じらしい。
クラスやトレイトを定義するために 使用したトレイト のことをミックスインと言うこともあるらしい。
らしい...
よくわからないのでとりあえず実装してみる。
```scala
// nameメソッドを持ったtraitを定義
scala> trait Subject {
     |   def name(x: String): Unit = {
     |     println(x)
     |   }
     | }
defined trait Subject

// classにtraitをミックスイン
scala> class Student extends Subject
defined class Student

// studentをインスタンス化
scala> val student = new Student
student: Student = Student@615eeace

// ミックスインしたtraitのメソッドを使用
scala> student.name("数学")
数学
```
上記の説明を行うと、traitの定義は上で説明したのと同じで、2番目でStudentというクラスを作成するときにextendsというミックスインするための記述を行っている。
これでStudentクラスはSubjectトレイトを継承しているので、nameメソッドが使えるようになった訳けです。
あとはいつも通りインスタンス化してメソッドを使用している。
今回はミックスインするときにextendsを使用しましたが、他にもwithというものもある。
extendsの場合は、他のクラスを継承しない場合に使用する。指定したトレイトのスーパークラス(親クラス)が暗黙の継承クラスとなる。スーパークラスが存在しない場合は、AnyRefクラスとなる。1つしか指定できないため、その他のトレイトはwithで指定する。
withの場合は、extendsを指定済みで、他のトレイトを指定する場合に使用する。

実際にwithも使って実装を行ってみる。
```scala
// 新たにScore traitを追加
scala> trait Score {
     |   def score(num: Int): Unit = {
     |     println(num)
     |   }
     | }
defined trait Score

// withを使い複数ミックスイン
scala> class Student extends Subject with Score
defined class Student

scala> val student = new Student
student: Student = Student@2240fa6b

scala> student.name("数学")
数学

scala> student.score(80)
80
```
上記は新たに作成したトレイトをwithを使いミックスインしている。
これによってStudentクラスは、SubjectとScore両方で定義されているメソッドを使用できるようになった。
今回はこんな感じで実装したが、もっと上手い使い方があるはず...

### 実装例
[trait実装例](https://github.com/takapi327/education-app/blob/master/app/model/common/Common.scala#L12)

```scala
// traitの定義
trait ViewValueCommon {
  val title:  String      
  val cssSrc: Seq[String]
  val jsSrc:  Seq[String] 
}

// ミックスイン
case class ViewValueTodo(
  title:  String,
  cssSrc: Seq[String],
  jsSrc:  Seq[String],
  body:   String
) extends ViewValueCommon
```
上記はコントローラーからビューに値を送るためのものです。
ここで送りたいものを定義して置いてまとめてビューに遅れるようにしています。
ミックスインをしていても新たに要素を追加することは可能です。
またViewValueを新たに作成するときは、全てViewValueCommonをextendsしてミックスインして使う必要があります。
それはビューを作成している大元で[@(vv: model.ViewValueCommon)](https://github.com/takapi327/education-app/blob/master/app/views/common/Default.scala.html#L7)という風に使用しているからです。
コードの中をみると何箇所かでこのvvという値を使っていると思います、これによってこの箇所ではvvの中にある値をとってくるという意味になります。
ただ表示したいビューによってtitleなどを変更したいと思いますが、これはextends ViewValueCommonでミックスインをしているので各々ViewValueCommonとしてもみることができるので、ビューによって使い分けができるようになっています。
説明がわかりにくいですが雰囲気はこんな感じで使います。w

## abstract
---
abstractクラスはabstractキーワードを使って定義します。
abstractクラスはメンバーの具体的な定義をせず、継承した子クラスで具体的に定義するとき時に利用します。

・抽象メンバーにはabstractキーワードが不要(abstractクラスのメンバーはデフォルトが抽象メンバーになる)

・メソッド以外にもフィールドを抽象化できる
実際に定義してみると下記のような実装になる。

```scala
// abstractの実装
scala> abstract class Subject {
     |   val name: String
     |   def score(arg: Int)
     | }
defined class Subject

// ミックスイン
scala> class Student extends Subject {
     |   val name = "数学"
     |   def score(arg: Int) = println(name  + arg + "点です")
     | }
defined class Student

scala> new Student
res3: Student = Student@7266541d

scala> res3.name
res4: String = 数学

scala> res3.score(80)
数学80点です
```
abstractは抽象フィールドと抽象メソッドの両方を定義できる。
abstractクラスを継承したクラスは必ず同じものを定義(オーバーライド)しなければコンパイルエラーとなってしまいます。

```scala
scala> class Student extends Subject {
     |    def score(arg: Int) = println(name  + arg + "点です")
     | }
<console>:12: error: class Student needs to be abstract, since value name in class Subject of type String is not defined
       class Student extends Subject {
```

またtraitと違う点は、abstractでは、抽象クラスであるために複数の親クラスを同時に継承、つまり多重継承を行うことができないという点です。traitが多重継承的なことができることと対照的になっています。

```scala
scala> abstract class Name {
     |   val fullName: String
     |   def age(arg: Int)
     | }
defined class Name

scala> class Student extends Subject with Name{
     |   val name = "数学"
     |   def score(arg: Int) = println(name  + arg + "点です")
     |   val fullName = "Test"
     |   def age(arg: Int) = println(fullName + arg + "才です")
     | }
<console>:13: error: class Name needs to be a trait to be mixed in
       class Student extends Subject with Name{
```
abstractの使い方は、Javaですが[abstractクラスの使い方の説明](http://www.itsenka.com/contents/development/java/abstract.html)がわかりやすかった。

## override
---
overrideは親クラスの実装内容を上書きすることができます。

```scala
scala> trait Subject {
     |   def name(x: String): Unit = {
     |     println(x)
     |   }
     | }
defined trait Subject

scala> class Student extends Subject {
     |   override def name(x: String): Unit = {
     |     println(x + "です。")
     |   }
     | }
defined class Student

scala> new Student
res2: Student = Student@2b5560e9

scala> res2.name("Test")
Testです。
```
overrideを使うことでミックスインした親クラスの実装内容を任意に変更することができる。
overrideの使い方は、[Scalaで抽象メソッドをoverrideする際にoverride修飾子を付けるべきかどうかの是非](https://xuwei-k.hatenablog.com/entry/20131220/1387509706)がわかりやすかった。

## final,private,sealed
---
Classの継承やメンバーのオーバーライドを制限する機能として「final」,「private」と「sealed」が存在する。
### final
・finalが定義されたクラスは継承ができない。
・finalが定義されたメンバーはオーバーライドができない。

```scala
scala> final class Last
defined class Last

// 継承不可
scala> class End extends Last
<console>:12: error: illegal inheritance from final class Last
       class End extends Last
                         ^

// override不可
scala> trait Subject {
     |   final def name(x: String): Unit = {
     |     println(x)
     |   }
     | }
defined trait Subject

scala> class Student extends Subject{
     |   override def name(x: String): Unit = {
     |     println("Hello" + x)
     |   }
     | }
<console>:13: error: overriding method name in trait Subject of type (x: String)Unit;
 method name cannot override final member
       override def name(x: String): Unit = {
                    ^
```
### private
privateはoverrideと外部のクラスから呼び出しをさせたくない場合に使用します。

```scala
scala> trait Subject {
     |   private def name(x: String): Unit = {
     |     println(x)
     |   }
     | }
defined trait Subject

scala> class Student extends Subject
defined class Student

scala> new Student
res0: Student = Student@2f5db1b6

scala> res0.name("Test")
<console>:13: error: value name is not a member of Student
       res0.name("Test")
            ^
```

### sealed
sealedはfinalと違いクラスに対してのみ定義します。
・sealedを定義したクラスは、同一ファイル内のクラスからは継承できますが、別ファイル内で定義されたクラスでは継承できない。
・sealedクラスを継承したクラスは、別ファイルのクラスからも継承できる。

app/model/main/Subject.scala
```scala
sealed trait Subject {
  def name(x: String): Unit = {
    println(x)
  }
}

// 同一ファイルなら継承可能
class Student extends Subject
```

app/model/main/Student.scala
```scala
// 別のファイルなのでコンパイルエラーが起こる
class OtherFileStudent extends Subject

// sealedクラスを継承したクラスは、別ファイルのクラスからも継承できる
class OtherFileStudent extends Student
```

## 参考文献
---
[トレイト](https://docs.scala-lang.org/ja/tour/traits.html)

[Scala研修テキスト トレイト](https://scala-text.github.io/scala_text/trait.html)

[Scalaの継承](http://engineer-hiko.hatenablog.com/entry/2014/09/26/174451)

[抽象クラスの使い方](http://www.itsenka.com/contents/development/java/abstract.html)

[Scalaクラス](http://www.ne.jp/asahi/hishidama/home/tech/scala/class.html)
