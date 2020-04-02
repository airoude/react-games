export const PLAYER_O = 'o'
export const PLAYER_X = 'x'
export type PLAYER = typeof PLAYER_O | typeof PLAYER_X
export type TilesMap = Map<number, PLAYER>;

export const states = {
  IDLE: 'idle',
  SELECT_TILE: 'selectTile',
  NEXT_TURN: 'nextTurn',
  WINNER: 'winner',
  DRAW: 'draw',
  NEXT_ROUND: 'nextRound',
  END_GAME: 'endGame',
}

export const winningCombination = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6]
]
