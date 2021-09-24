/**
 * 型安全なアサーション関数isを実装
 *
 * 例: is(1, 1, 1) <- true
 *     is(1, 2, 3) <- false
 */
/*
 * 自分の回答
function is<T>(
  node: T,
  value: T
): boolean {
  return node === value
}

is(12, 12)
*/

/**
 * 回答
 */
function is<T>(
  value: T, ...values: [...T[]]
): boolean {
  return values.every(_ => _ === value)
}

is(12, 12, 12)
