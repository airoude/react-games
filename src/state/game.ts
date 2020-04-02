import { assign, EventObject, Machine } from 'xstate'
import { PLAYER, TilesMap, PLAYER_O, PLAYER_X, winningCombination, states } from '../constants'

export interface GameContext {
  winner: string | null;
  draw: boolean;
  round: number;
  currentPlayer: PLAYER;
  selectedTiles: TilesMap;
}

export interface GameEvents extends EventObject {
  tileId: number;
}

export const checkWinner = (tiles: TilesMap, currentPlayer: PLAYER) => winningCombination.some(combination => {
  return combination.every(index => tiles.get(index) === currentPlayer)
})
export const checkDraw = (tiles: TilesMap) => tiles.size === 9

export default Machine<GameContext, GameEvents>({
  id: 'game',
  initial: states.IDLE,
  context: {
    round: 1,
    winner: null,
    draw: false,
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
          }),
          cond: (ctx, e) => !ctx.selectedTiles.has(e.tileId)
        }
      },
    },
    [states.NEXT_TURN]: {
      on: {
        [states.WINNER]: {
          target: states.END_GAME,
          actions: assign({
            winner: ctx => ctx.currentPlayer
          }),
        },
        [states.DRAW]: {
          target: states.END_GAME,
          actions: assign({
            draw: ctx => true
          }),
          cond: ctx => ctx.round === 9
        },
        [states.NEXT_ROUND]: {
          target: states.IDLE,
          actions: assign({
            currentPlayer: ctx => PLAYER_O === ctx.currentPlayer ? PLAYER_X : PLAYER_O,
            round: ctx => ctx.round + 1
          }),
          cond: ctx => ctx.round < 9
        }
      }
    },
    [states.END_GAME]: {
      type: 'final'
    },
  },
})
