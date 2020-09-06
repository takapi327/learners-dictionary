/*
object June28th extends App {

  case class User(
    id:   Option[Int],
    name: String
  )

  case class Todo(
    uid:  Int,
    todo: String,
  )

  case class UserTodo(
    id:   Option[Int],
    name: String,
    uid:  Int,
    todo: String,
    address: String,
    tel:     Int
  )

  case class UserDetail(
    address: String,
    tel:     Int
  )


    val seqUser = Seq(
      User(Some(1), "田中"),
      User(Some(2), "山田"),
      User(Some(3), "佐々木"),
      User(Some(4), "石田"),
      User(Some(5), "鈴木")
    )

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

    val seqDetail = Seq(
      UserDetail("兵庫県", 9),
      UserDetail("大阪府", 4),
      UserDetail("東京都", 3),
      UserDetail("京都府", 4),
      UserDetail("北海道", 5),
      UserDetail("福岡県", 6)
    )

    val mapTodo     = seqTodo.map(v => v.uid -> v).toMap
    val userTodo    = seqUser.map(u =>
        u.id match {
          case Some(uid) => (u, mapTodo.get(uid))
          case None      => (u, None)
        } 
    )

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

    val u = for{
      user   <- seqUser
      todo   <- seqTodo
      detail <- seqDetail
    } yield {
      if(user.id.get == todo.uid){
        UserTodo(
          user.id,
          user.name,
          todo.uid,
          todo.todo,
          detail.address,
          detail.tel
        )
      }
    }
    val v = seqUser ++ seqTodo ++ seqDetail
    println(u.filterNot(_ == Nil))
    //println(v)
}

*/
