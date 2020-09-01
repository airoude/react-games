import React, { FC } from 'react'
import { useMachine } from '@xstate/react/lib'
import { CurrentGameContext } from 'contexts/currentGame'
import gameMachine, { Events, States } from 'state/game'
import Board from 'components/Board'
import Button from 'components/Button'
import Message from 'components/Message'
import Center from 'components/Center'
import Status from 'components/Status'

const App: FC = () => {
  const [state, send] = useMachine<GameContext, GameEvent>(gameMachine, { devTools: true })

  if (state.matches(States.winner) || state.matches(States.draw)) {
    return (
      <Center>
        <Message style={{ marginBottom: 64 }} type={state.matches(States.draw) ? 'primary' : 'success'}>
          {state.matches(States.draw) && <span>IT'S A DRAW 👏🏼</span>}
          {state.matches(States.winner) && <span><b>{state.context.winner}</b> HAS WON 🎉</span>}
        </Message>

        <Button
          size="lg"
          onClick={() => send(Events.RESET)}>
          Replay 👾
        </Button>
      </Center>
    )
  }

  return (
    <CurrentGameContext.Provider value={state.context}>
      <Status />

      <Center>
        <Board
          state={state}
          selectTile={(tileId: number) => send({ type: Events.SELECT_TILE, tileId })} />
      </Center>
    </CurrentGameContext.Provider>
  );
}

export default App;
