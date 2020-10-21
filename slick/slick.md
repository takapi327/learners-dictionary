# Slick

## コンソール実行
```scala
import slick.jdbc.JdbcProfile
import slick.basic.DatabaseConfig

val dbConfig: DatabaseConfig[JdbcProfile] = DatabaseConfig.forConfig[JdbcProfile]("default")
val profile:  JdbcProfile                 = dbConfig.profile
```
