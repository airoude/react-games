import * as React from 'react';
import { createActorContext } from '@xstate/react';
import { assign, createMachine } from 'xstate';
import { SnakeMachineEvents, SnakeStateContext } from './types.ts';
import { Board } from './components/Board.tsx';

const initialContext = {
};

const machine = createMachine({
  types: {
    context: {} as SnakeStateContext,
    events: {} as SnakeMachineEvents,
  },
  context: initialContext,
  initial: 'playing',
  states: {
    playing: {},
  }
}, {
  actions: {
  },
  guards: {
  }
});

export const SnakeContext = createActorContext(machine);

export const Game = (): JSX.Element => (
  <SnakeContext.Provider
    machine={machine}
  >
    <Board />
  </SnakeContext.Provider>
);
