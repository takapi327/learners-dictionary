object Atcode02 extends App {
  val sc = new java.util.Scanner(System.in)
  val n  = sc.nextInt()
  println(n * (n + 1) / 2)
  /*
  println(List.fill(10)(sc.nextInt()).foldLeft(0){(x, acc) => acc + x + acc + 1})
  */
}
