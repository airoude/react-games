import React, { FC, useCallback } from 'react';
import { useMachine } from '@xstate/react/lib';
import { inspect } from '@xstate/inspect';
import { CurrentGameContext } from 'games/tictactoe/contexts/currentGame';
import gameMachine, { Events, States } from 'states/tictactoe';
import Board from 'games/tictactoe/components/Board';
import Button from 'games/tictactoe/components/Button';
import Message from 'games/tictactoe/components/Message';
import Center from 'games/tictactoe/components/Center';
import Status from 'games/tictactoe/components/Status';
import { isDev } from 'utils';
import '__styles/tictactoe.module.css';

inspect({
  url: 'https://statecharts.io/inspect',
  iframe: false
});

const Screen: FC = () => {
  const [state, send] = useMachine<TicTacToeStateContext, TicTacToeStateEvent>(gameMachine, { devTools: isDev() });

  const selectTile = useCallback(
    (tileId: number) => send({ type: Events.SELECT_TILE, tileId }),
    []
  )

  if (state.matches(States.winner) || state.matches(States.draw)) {
    return (
      <Center>
        <Message style={{ marginBottom: 64 }} type={state.matches(States.draw) ? 'primary' : 'success'}>
          {state.matches(States.draw) && (
            <span role="img" aria-label="Draw">
              IT'S A DRAW 👏🏼
            </span>
          )}
          {state.matches(States.winner) && (
            <span role="img" aria-label="Winner">
              <b>{state.context.winner}</b> HAS WON 🎉
            </span>
          )}
        </Message>

        <Button size="lg" onClick={() => send(Events.RESET)}>
          Replay 👾
        </Button>
      </Center>
    );
  }

  return (
    <CurrentGameContext.Provider value={state.context}>
      <Center>
        <Board
          state={state}
          selectTile={selectTile} />
      </Center>

      <Status />
    </CurrentGameContext.Provider>
  );
};

export default Screen;
