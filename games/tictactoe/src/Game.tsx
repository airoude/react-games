import * as React from 'react';
import { createActorContext } from '@xstate/react';
import { assign, createMachine } from 'xstate';
import { Board } from './components/Board';
import { winningCombination } from './utils';
import { Player, TicTacToeEvents, TicTacToeMachineEvents, TicTacToeStateContext } from './types';

const initialContext = {
  winner: undefined,
  moves: 0,
  tiles: Array(9).fill(null),
  currentPlayer: Math.floor(Math.random() * 2) === 0 ? Player.X : Player.O,
};

const machine = createMachine({
  types: {
    context: {} as TicTacToeStateContext,
    events: {} as TicTacToeMachineEvents,
  },
  context: initialContext,
  initial: 'playing',
  states: {
    playing: {
      always: [
        { target: 'finished.winner', guard: 'checkWin' },
        { target: 'finished.draw', guard: 'checkDraw' }
      ],
      on: {
        selectTile: {
          target: 'playing',
          guard: 'isValidMove',
          actions: 'updateBoard'
        }
      }
    },
    finished: {
      initial: 'winner',
      states: {
        winner: {
          tags: 'winner',
          entry: 'setWinner'
        },
        draw: {
          tags: 'draw',
        }
      },
      on: {
        [TicTacToeEvents.Reset]: {
          target: 'playing',
          actions: 'reset'
        }
      }
    }
  },
}, {
  actions: {
    reset: assign({
      ...initialContext,
      // We want to ensure that the first player is always different
      currentPlayer: Math.floor(Math.random() * 2) === 0 ? Player.X : Player.O,
    }),
    updateBoard: assign({
      tiles: ({ context, event }) => {
        if (event.type !== TicTacToeEvents.SelectTile) {
          return context.tiles;
        }

        if (context.tiles[event.tileId] !== null) {
          return context.tiles;
        }

        const nextTiles = [...context.tiles];
        nextTiles[event.tileId] = context.currentPlayer;

        return nextTiles;
      },
      moves: ({ context }) => context.moves + 1,
      currentPlayer: ({ context }) => context.currentPlayer === Player.O ? Player.X : Player.O
    }),
    setWinner: assign({
      winner: ({ context }) => context.currentPlayer === Player.O ? Player.X : Player.O,
    }),
  },
  guards: {
    checkWin: ({ context }) => winningCombination.some(combination => {
      const playerX = combination.every(index => context.tiles[index] === Player.X);
      if (playerX) return true;

      return combination.every(index => context.tiles[index] === Player.O);
    }),
    checkDraw: ({ context }) => context.moves === 9,
    isValidMove: ({ context, event }) => {
      if (event.type !== TicTacToeEvents.SelectTile) {
        return false;
      }

      return context.tiles[event.tileId] === null;
    }
  }
});

export const TicTacToeContext = createActorContext(machine);

export const Game = (): JSX.Element => (
  <TicTacToeContext.Provider
    machine={machine}
  >
    <Board />
  </TicTacToeContext.Provider>
);
