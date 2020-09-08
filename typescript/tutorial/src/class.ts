/**
 * クラス
 * @param チェスゲーム
 */
class Game {
  private pieces = Game.makePieces()
  private static makePieces() {
    return [
      new King('White', 'E', 1),
      new King('Black', 'E', 8),

      new Queen('White', 'D', 1),
      new Queen('Black', 'D', 8)
    ]
  }
}

/**
 * クラス
 * @param チェスの駒
 */
abstract class Piece {
  protected position: Position
  constructor(
    private readonly color: Color,
    file: Files,
    rank: Rank
  ) {
    this.position = new Position(file, rank)
  }

  moveTo(position: Position) {
    this.position = position
  }
  abstract canMoveTo(position: Position): boolean
}

/**
 * クラス
 * @param 駒の位置
 */
class Position {
  constructor(
    private file: Files,
    private rank: Rank
  ) {}

  
  distanceFrom(position: Position) {
    return {
      rank: Math.abs(position.rank - this.rank),
      file: Math.abs(position.file.charCodeAt(0) - this.file.charCodeAt(0))
    }
  }
}

/**
 * キング
 */
class King extends Piece {
  canMoveTo(position: Position): boolean {
    let distance = this.position.distanceFrom(position)
    return distance.rank < 2 && distance.file < 2
  }
}
/**
 * クイーン
 */
class Queen extends Piece {
  canMoveTo(position: Position): boolean {
    let distance = this.position.distanceFrom(position)
    return distance.rank < 2 && distance.file < 2
  }  
}
/**
 * ビショップ
 */
class Bishop extends Piece{
  canMoveTo(position: Position): boolean {
    let distance = this.position.distanceFrom(position)
    return distance.rank < 2 && distance.file < 2
  }
}
/**
 * ナイト
 */
class Knight extends Piece{
  canMoveTo(position: Position): boolean {
    let distance = this.position.distanceFrom(position)
    return distance.rank < 2 && distance.file < 2
  }
}
/**
 * ルーク
 */
class Rook extends Piece {
  canMoveTo(position: Position): boolean {
    let distance = this.position.distanceFrom(position)
    return distance.rank < 2 && distance.file < 2
  }
}
/**
 * ポーン
 */
class Pawn extends Piece{
  canMoveTo(position: Position): boolean {
    let distance = this.position.distanceFrom(position)
    return distance.rank < 2 && distance.file < 2
  }
}

type Color  = 'Black' | 'White'
type Files  = 'A' | 'B' | 'C' | 'D' | 'E' | 'F' | 'G' | 'H'
type Rank   = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8

class Sets {
  isHas(value: number): boolean {
    return value === value
  }
  isAdd(value: number): this {
    return this
  }
}

class MultiSetw extends Sets {
  isDelete(value: number): boolean {
    return true
  }
/*
  isAdd(value: number): this {
    return this
  }
*/
}

let a = new MultiSetw
let A: boolean = a.isDelete(1)
let b: MultiSetw = a.isAdd(1)
a.isHas(1)


