# Slick

## コンソール実行
```scala
import slick.jdbc.JdbcProfile
import slick.basic.DatabaseConfig

val dbConfig: DatabaseConfig[JdbcProfile] = DatabaseConfig.forConfig[JdbcProfile]("default")
val profile:  JdbcProfile                 = dbConfig.profile
```

```
default {
  profile = "slick.jdbc.MySQLProfile$"
  db {
    dataSourceClass = "slick.jdbc.DatabaseUrlDataSource"
    properties {
      driver   = com.mysql.jdbc.Driver
      user     = "root"
      url      = "jdbc:mysql://localhost/データベース名"
      password = ""
    }
  }
}
```

## andThen (or >>)
## DBIO.seq
## map
## DBIO.successful and DBIO.failed
## flatMap
## DBIO.sequence
## DBIO.fold
## zip
## andFinally and cleanUp
## asTry
