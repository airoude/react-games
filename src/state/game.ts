import { assign, Machine, MachineOptions, MachineConfig } from 'xstate'
import { PLAYER_O, PLAYER_X, winningCombination } from 'consts'

export const States: Record<States, States> = {
  playing: 'playing',
  winner: 'winner',
  draw: 'draw',
}

export const Events: Record<string, GameEvent['type']> = {
  SELECT_TILE: 'selectTile',
  RESET: 'reset',
}

export const initialContext: GameContext = {
  round: 1,
  winner: undefined,
  draw: undefined,
  currentPlayer: (Math.floor(Math.random() * 2) === 0) ? PLAYER_X : PLAYER_O,
  tiles: new Map<number, Player | null>(Array(9).fill(null).map((v, i) => ([i, null]))),
}

const machineConfig: MachineConfig<GameContext, GameStateSchema, GameEvent> = {
  id: 'tictactoe',
  initial: States.playing,
  strict: true,
  states: {
    playing: {
      always: [
        { target: States.winner, cond: 'checkWinner' },
        { target: States.draw, cond: 'checkDraw' },
      ],
      on: {
        [Events.SELECT_TILE]: {
          target: States.playing,
          cond: 'isValidMove',
          actions: 'updateTiles',
        },
      },
    },
    winner: {
      entry: 'setWinner',
    },
    draw: {
      entry: 'setDraw'
    },
  },
  on: {
    [Events.RESET]: {
      target: States.playing,
      actions: 'reset'
    }
  }
}

const machineOptions: MachineOptions<GameContext, GameEvent> = {
  activities: {},
  delays: {},
  services: {},
  actions: {
    reset: assign({
      round: ctx => 1,
      winner: ctx => undefined,
      draw: ctx => undefined,
      currentPlayer: ctx => (Math.floor(Math.random() * 2) === 0) ? PLAYER_X : PLAYER_O,
      tiles: ctx => new Map<number, Player | null>(Array(9).fill(null).map((v, i) => ([i, null]))),
    }),
    updateTiles: assign({
      round: ctx => ctx.round + 1,
      // @ts-ignore
      tiles: (ctx, e) => ctx.tiles.set(e.tileId, ctx.currentPlayer),
      currentPlayer: ctx => ctx.currentPlayer === PLAYER_O ? PLAYER_X : PLAYER_O,
    }),
    setWinner: assign({
      winner: ctx => ctx.currentPlayer === PLAYER_O ? PLAYER_X : PLAYER_O
    }),
    setDraw: assign({
      draw: ctx => true,
    })
  },
  guards: {
    checkWinner: ctx => {
      const player = ctx.currentPlayer === PLAYER_O ? PLAYER_X : PLAYER_O;

      return winningCombination.some(combination => {
        return combination.every(index => {
          return ctx.tiles.get(index) === player
        })
      })
    },
    checkDraw: ctx => ctx.round === 10,
    // @ts-ignore
    isValidMove: (ctx, e) => ctx.tiles.get(e.tileId) === null,
  }
}

export default Machine<GameContext, GameStateSchema, GameEvent>(machineConfig, machineOptions, initialContext)
