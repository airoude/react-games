import { assign, Machine } from 'xstate'
import { PLAYER, PLAYER_O, PLAYER_X } from '../constants'

export const states = {
  IDLE: 'idle',
  SELECT_TILE: 'selectTile',
  NEXT_TURN: 'nextTurn',
  WINNER: 'winner',
  DRAW: 'draw',
  NEXT_ROUND: 'nextRound',
  END_GAME: 'endGame',
}

const WINNING_COMBINATIONS = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6]
]

type TilesMap = Map<number, PLAYER>;

interface ContextProps {
  winner: string | null | boolean;
  currentPlayer: PLAYER,
  round: number;
  selectedTiles: TilesMap,
}

export const checkWinner = (tiles: TilesMap, currentPlayer: PLAYER) => {
  return WINNING_COMBINATIONS.some(combination => {
    return combination.every(index => {
      return tiles.get(index) === currentPlayer
    })
  })
}

export const checkDraw = (tiles: TilesMap) => tiles.size === 9

export default Machine<ContextProps>({
  id: 'game',
  initial: states.IDLE,
  context: {
    round: 1,
    winner: null,
    currentPlayer: (Math.floor(Math.random() * 2) === 0) ? PLAYER_X : PLAYER_O,
    selectedTiles: new Map<number, PLAYER>([]),
  },
  states: {
    [states.IDLE]: {
      on: {
        [states.SELECT_TILE]: {
          target: states.NEXT_TURN,
          actions: assign({
            selectedTiles: (ctx, e) => ctx.selectedTiles.set(e.tileId, ctx.currentPlayer),
          })
        }
      },
    },
    [states.NEXT_TURN]: {
      on: {
        [states.WINNER]: {
          target: states.END_GAME,
          actions: assign({
            winner: (ctx, e) => e.winner
          })
        },
        [states.DRAW]: {
          target: states.END_GAME,
          actions: assign({
            winner: (ctx, e) => e.winner
          })
        },
        [states.NEXT_ROUND]: {
          target: states.IDLE,
          actions: assign({
            currentPlayer: (ctx, e) => PLAYER_O === ctx.currentPlayer ? PLAYER_X : PLAYER_O,
            round: (ctx, e) => ctx.round + 1
          })
        }
      }
    },
    [states.END_GAME]: {
      type: 'final'
    },
  },
})
