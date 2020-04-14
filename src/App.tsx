import React, { FC } from 'react'
import { useMachine } from 'state/useMachine'
import gameMachine from 'state/game'
import { CurrentPlayerContext } from 'contexts/currentPlayer'
import { states } from 'consts'
import Board from 'components/Board'
import Button from 'components/Button'
import Message from 'components/Message'
import Center from 'components/Center'
import styles from './App.module.css'

const App: FC = () => {
  const [machineState, machineService] = useMachine(gameMachine)

  if (machineState.matches(states.END_GAME)) {
    return (
      <Center>
        <Message style={{ marginBottom: 64 }} type={machineState.context.draw ? 'primary' : 'success'}>
          {machineState.context.draw && <span>IT'S A DRAW 👏🏼</span>}
          {!machineState.context.draw && <span><b>{machineState.context.winner}</b> HAS WON 🎉</span>}
        </Message>

        <Button
          size="lg"
          onClick={() => window.location.reload()}>
          Replay 👾
        </Button>
      </Center>
    )
  }

  return (
    <CurrentPlayerContext.Provider value={machineState.context.currentPlayer}>
      <div className={styles.status}>
        <span>ROUND {machineState.context.round}</span>
        <span>{machineState.context.currentPlayer}'s TURN</span>
      </div>

      <Center>
        <Board
          machineState={machineState}
          machineService={machineService} />
      </Center>
    </CurrentPlayerContext.Provider>
  );
}

export default App;
