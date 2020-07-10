object June28th extends App {

  case class User(
    id:   Option[Int],
    name: String
  )

  case class Todo(
    uid:  Int,
    todo: String,
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
}

