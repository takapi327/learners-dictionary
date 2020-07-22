# はじめに
はじめまして。ネクストビートに2020年4月より未経験中途エンジニアとして入社した富永(トミナガ)と申します！

### 自己紹介
富永 孝彦(トミナガ タカヒコ) 24歳
```
2018/04 - 新卒で不動産営業を経験
2019/10 - TECH::CAMP(旧TECH::EXPERT)夜間に入学
2019/01 - TECH::CAMP(旧TECH::EXPERT)短期に編入
2020/04 - NextBeatに入社
```
上記が私の経歴ですが、ご覧の通りプログラミングを初めてまだ数ヶ月のエンジニアです。

### 記事に関して
この度ネクストビートに入社して4月から5月までの２ヶ月間ScalaとPlayFrameworkを使った研修を受けました。
今回はその中で学んだ、弊社CTOの衣笠が開発したOSSであるIxiaSについて紹介をさせていただく第2弾となります！
初学者が理解した程度の知識ですので、至らない点が多々あるかとは思いますが最後まで読んでいただければ幸いです。

### ixias.persistenceパッケージ
今回紹介するのは、ixias.persistenceパッケージです。
ixias.persistenceパッケージは永続ストレージとの連携を行い、ixias.modelパッケージと組み合わせることでwebアプリケーションとして様々な機能を実装できるようになるものです。
ixias.modelパッケージに関しては、第1弾として20新卒の久代(クシロ)が紹介を行っていますので、そちらをご覧いただければと思います。
[自社OSS 「IxiaS」の紹介 ~ ixias.modelパッケージのサンプルコード ~](https://medium.com/nextbeat-engineering/%E8%87%AA%E7%A4%BEoss-ixias-%E3%81%AE%E7%B4%B9%E4%BB%8B-ixais-model%E3%83%91%E3%83%83%E3%82%B1%E3%83%BC%E3%82%B8%E3%81%AE%E3%82%B5%E3%83%B3%E3%83%97%E3%83%AB%E3%82%B3%E3%83%BC%E3%83%89-d6e0e5d8e8aa)

上記第１弾でIxiaSに関する内容、インストール方法に関しては紹介しておりますので割愛させていただきます。
それでは早速ixias.persistenceパッケージに関しての紹介を行っていきます。

## 目次
- [サンプルコード]()
  - [SlickRepository]()
    - [Repository]()
      - [EntityIOAction]()
      - [Entity]()
    - [SlickProfile]()
      - [SlickDBActionProvider]()
      - [SlickRunDBAction]()
      - [application.conf]()
  - [SlickResourceProvider]()
- [参考文献]()

### サンプルコード
ixias.persistenceパッケージは以下のような実装によって使用します。
テーブル定義に関して説明を入れてしまうと長くなってしまいますので、次の機会に紹介を行いたいと思います。

フォルダ構成
app/lib/persistence/User.scala
```scala
  /**
  * This is a sample of CRUD Action.
  * 
  **/

package lib.persistence

import lib.model.User  // ixias.modelで定義したものをimport
import scala.concurrent.Future
import slick.jdbc.JdbcProfile
import ixias.persistence.SlickRepository

// UserRepository: UserTableへのクエリ発行を行うRepository層の定義
//~~~~~~~~~~~~~~~~~~~~~~
case class UserRepository[P <: JdbcProfile]()(implicit val driver: P)
  extends SlickRepository[User.Id, User, P]
  with db.SlickResourceProvider[P] {

  import api._

  /**
    * Get User Data
    */
  def get(id: Id): Future[Option[EntityEmbeddedId]] =
    RunDBAction(UserTable, "slave") { _
      .filter(_.id === id)
      .result.headOption
  }

  /**
    * Add User Data
   */
  def add(entity: EntityWithNoId): Future[Id] =
    RunDBAction(UserTable) { slick =>
      slick returning slick.map(_.id) += entity.v
    }

  /**
   * Update User Data
   */
  def update(entity: EntityEmbeddedId): Future[Option[EntityEmbeddedId]] =
    RunDBAction(UserTable) { slick =>
      val row = slick.filter(_.id === entity.id)
      for {
        old <- row.result.headOption
        _   <- old match {
          case None    => DBIO.successful(0)
          case Some(_) => row.update(entity.v)
        }
      } yield old
    }

  /**
   * Delete User Data
   */
  def remove(id: Id): Future[Option[EntityEmbeddedId]] =
    RunDBAction(UserTable) { slick =>
      val row = slick.filter(_.id === id)
      for {
        old <- row.result.headOption
        _   <- old match {
          case None    => DBIO.successful(0)
          case Some(_) => row.delete
        }
      } yield old
    }
}
```

### SlickRepositoryの継承
```scala
case class UserRepository[P <: JdbcProfile]()(implicit val driver: P)
  extends SlickRepository[User.Id, User, P]
  with db.SlickResourceProvider[P] {
}
```
ケースクラス`UserRepository`は、[SlickRepositoryトレイト](https://github.com/ixias-net/ixias/blob/develop/framework/ixias-core/src/main/scala/ixias/persistence/SlickRepository.scala#L62)と`db.SlickResourceProviderトレイト`を継承しています。

### なぜSlickRepositoryトレイトを継承するのか
`SlickRepositoryトレイト`の構造は下記画像のようになっており他のトレイトを継承しています。

![Copy of Untitled Diagram (1)](https://user-images.githubusercontent.com/57429437/87244006-c6939580-c475-11ea-8f45-6a93e1fa8138.png)


複数のトレイトを継承した`SlickRepositoryトレイト`を継承していることで、各トレイトで実装しているものが使用可能になります。
例えばCRUD機能を行うためのメソッドや、永続ストレージとの連携を行うための機能、modelで定義した`EmbeddedId`などのixias.modelと連携するための型といったものです。

### SlickRepositoryの定義
`SlickRepositoryトレイト`の定義元では、[Repositoryトレイト](https://github.com/ixias-net/ixias/blob/develop/framework/ixias-core/src/main/scala/ixias/persistence/Repository.scala#L51)を継承しており、型パラメーターである`K`と`M`にそれぞれ引数で受け取った値`User.Id`と`User`を渡しています。
もう１つの型パラメーターである`P`に、受け取ったslickのJdbcProfileを渡し、同ファイル内で定義してある[SlickProfileトレイト](https://github.com/ixias-net/ixias/blob/develop/framework/ixias-core/src/main/scala/ixias/persistence/SlickRepository.scala#L20)に渡しています。
SlickProfileトレイトは、`SlickRunDBAction`などを定義して、永続ストレージとの連携を行う[SlickDBActionProvider](https://github.com/ixias-net/ixias/blob/develop/framework/ixias-core/src/main/scala/ixias/persistence/action/SlickDBAction.scala#L18)を継承しています。
```scala
trait SlickRepository[K <: @@[_, _], M <: EntityModel[K], P <: JdbcProfile]
    extends Repository[K, M] with SlickProfile[P] {
  trait API extends super.API
      with SlickDBIOActionOps[K, M]
  override val api: API = new API {}
}
```
`SlickRepository`内では、永続ストレージとやりとりをする窓口を作り、永続ストレージとデータのやりとりや連携ができる状態にするためにAPIの定義を行っています。

`SlickRepositoryトレイト`を継承するだけで、メソッドの命名や引数と返り値の型を統一しつつ、CRUD機能の実装と永続ストレージとの接続を簡単に行えるようになります。

### Repositoryの定義
値を渡した[Repositoryトレイト](https://github.com/ixias-net/ixias/blob/develop/framework/ixias-core/src/main/scala/ixias/persistence/Repository.scala#L51)は更に`EntityIOAction`を継承しており、渡された型パラメーターを`EntityIOAction`にも渡しています。
```scala
trait Repository[K <: @@[_, _], M <: EntityModel[K]]
    extends Profile with EntityIOAction[K, M]
```
同ファイル内で定義した`Profile`も継承しており、`Profile`内では暗黙的なデータベース接続を行うための定義がしてあります。

### EntityIOActionの定義
[`EntityIOActionトレイト`](https://github.com/ixias-net/ixias/blob/develop/framework/ixias-core/src/main/scala/ixias/persistence/dbio/EntityIOAction.scala#L18)内では`EntityWithNoId`、`EntityEmbeddedId`の型、CRUD機能のために下記４つのメソッドを定義しています。
```scala
def get(id: Id): Future[Option[EntityEmbeddedId]]
def add(entity: EntityWithNoId): Future[Id]
def update(entity: EntityEmbeddedId): Future[Option[EntityEmbeddedId]]
def remove(id: Id): Future[Option[EntityEmbeddedId]]
```
4つのメソッドは、[自社OSS 「IxiaS」の紹介 ~ ixias.modelパッケージのサンプルコード ~](https://medium.com/nextbeat-engineering/%E8%87%AA%E7%A4%BEoss-ixias-%E3%81%AE%E7%B4%B9%E4%BB%8B-ixais-model%E3%83%91%E3%83%83%E3%82%B1%E3%83%BC%E3%82%B8%E3%81%AE%E3%82%B5%E3%83%B3%E3%83%97%E3%83%AB%E3%82%B3%E3%83%BC%E3%83%89-d6e0e5d8e8aa)で説明されたように使用します。
>1. UserのコンストラクタによってWithNoId型のEntityインスタンスを生成
>2. 生成したWithNoId型のインスタンスをaddメソッドに渡し、永続ストレージにレコードを追加
>3. getメソッドの引数にIdを渡し、該当するレコードをEmbeddedId型のEntityインスタンスとして取得
>4. 取得したEmbeddedId型のインスタンスに更新処理を加え、updateメソッドの引数に渡すことでレコードを更新
>5. deleteメソッドの引数にIdを渡し、該当するレコードを削除

`EntityIOAction`を継承していることで、CRUD処理等のメソッドの命名や引数と返り値の型を統一することができ、プロダクトを標準化して実装していけるということです。
### [Profileの定義](https://github.com/ixias-net/ixias/blob/develop/framework/ixias-core/src/main/scala/ixias/persistence/Repository.scala#L21)
Profileトレイトでは、すべてのプロファイルで実装する必要がある基本機能の永続ストレージ、バックエンド、ログ、ExecutionContext、APIの設定を行っています。
Profileトレイト継承することで型統一を行いつつ任意の実装を行えるようになります。

```scala
type Database <: AnyRef

type Backend  <: ixias.persistence.backend.BasicBackend[Database]

protected val backend: Backend

protected lazy val logger  =
    new Logger(LoggerFactory.getLogger(this.getClass.getName))

protected implicit val ctx = Execution.Implicits.trampoline

trait API extends Aliases with ExtensionMethods
  val api: API
```

### [SlickProfileの定義](https://github.com/ixias-net/ixias/blob/develop/framework/ixias-core/src/main/scala/ixias/persistence/SlickRepository.scala#L20)
ここからは、永続ストレージとの接続を行うための設定を行っているファイルを見ていきます。
永続ストレージを読み込み用と書き込み用で切り替えて実装を行っていけるのもここから説明をするトレイトのおかげです。
SlickProfileでは、JdbcProfileを抽象化したコンポーネント（trait）を継承した実装時に各DBのドライバで具象化したコンポーネント
[BasicBackend[T]](https://github.com/ixias-net/ixias/blob/develop/framework/ixias-core/src/main/scala/ixias/persistence/backend/BasicBackend.scala#L20)
### [SlickDBActionProviderの定義](https://github.com/ixias-net/ixias/blob/develop/framework/ixias-core/src/main/scala/ixias/persistence/action/SlickDBAction.scala#L18)
IxirSでは、リポジトリで機能を実装するときに永続ストレージのテーブルと「追加、削除、編集」などの永続ストレージに対して処理を行う場合は`master`、永続ストレージから値を参照するような時は`slave`というように、レプリケーションを行っている永続ストレージを指定して実装を行うことができます。
このように処理と参照を分けることで永続ストレージの障害対策と負荷分散を行うことができます。

![Untitled Diagram (2)](https://user-images.githubusercontent.com/57429437/87560817-d077fb80-c6f6-11ea-8547-a9fa092b0ce2.png)

[SlickRunDBAction](https://github.com/ixias-net/ixias/blob/develop/framework/ixias-core/src/main/scala/ixias/persistence/action/SlickDBAction.scala#L66)
`SlickRunDBAction`にテーブルと永続ストレージ(defaultではmaster)を指定することでdb.runという`slick.jdbc.JdbcBackend`トレイトに用意されている(実際はDatabaseDefというクラス)タイプのメソッドを非同期で実行しFutureとして返しています。

```scala
object SlickRunDBAction extends SlickDBAction {
  def apply[A, B, T <: Table[_, P]]
    (table: T, hostspec: String = DEFAULT_DSN_KEY)
    (action: T#Query => DBIOAction[A, NoStream, Nothing])
    (implicit conv: A => B): Future[B] =
    for {
      dsn    <- Future(table.dsn.get(hostspec).get)
      value  <- SlickDBAction[T].invokeBlock(SlickDBActionRequest(dsn, table), {
        case (db, slick) => db.run(action(slick))
      })
    } yield conv(value)
}
```
[DataSourceName](https://github.com/ixias-net/ixias/blob/develop/framework/ixias-core/src/main/scala/ixias/persistence/model/DataSourceName.scala#L14)
```scala
val DEFAULT_DSN_KEY = DataSourceName.RESERVED_NAME_MASTER  // "master"
```


#### application.conf
Slick用のDB設定をapplication.confに追記します。
readonlyがfalseなら先頭サーバを参照し、trueなら二番目以降のサーバを参照するというものです。
```scala
ixias.db.mysql {
  username                      = "username"
  password                      = "password"
  driver_class_name             = "com.mysql.jdbc.Driver" // MySQLを指定
  hostspec.master.readonly      = false
  hostspec.master.max_pool_size = 1
  hostspec.slave.readonly       = true
  hostspec.slave.max_pool_size  = 1

  databaseName {
    database               = "databaseName"
    hostspec.master.hosts  = "127.0.0.1:33306" // 今回は同じものを指定
    hostspec.slave.hosts   = "127.0.0.1:33306" // 今回は同じものを指定
  }
}

```
app/lib/persistence/db/SlickResourceProvider.scala
```scala

/**
  * This is a sample of Todo Application.
  * 
  */

package lib.persistence.db

import slick.jdbc.JdbcProfile

// Tableを扱うResourceのProvider
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
trait SlickResourceProvider[P <: JdbcProfile] {

  implicit val driver: P
  object UserTable extends UserTable
  // --[ テーブル定義 ] --------------------------------------
  lazy val AllTables = Seq(
    UserTable
  )
}
```

app/lib/persistence/package.scala
```scala
/**
  * This is a sample of Todo Application.
  * 
  */

package lib

package object persistence {

  val default = onMySQL

  object onMySQL {
    implicit lazy val driver = slick.jdbc.MySQLProfile
    object UserRepository extends UserRepository
  }
}
```
## 参考文献
[今さら聞けないIT用語：やたらと耳にするけど「API」って何？](https://data.wingarc.com/what-is-api-16084)<br>
[Best Practices for Using Slick on Production](https://blog.knoldus.com/best-practices-for-using-slick-on-production/)<br>
[Future や ExecutionContext をなんとなく触ってる人のために](https://qiita.com/takat0-h0rikosh1/items/b42cd4dd4ca0fc6770fa)<br>
[自分型](https://docs.scala-lang.org/ja/tour/self-types.html)<br>
