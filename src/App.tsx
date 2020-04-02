import React, { FC } from 'react'
import Board from './components/Board'
import { useMachine } from './state/useMachine'
import gameMachine from './state/game'
import { CurrentPlayerContext } from './contexts/currentPlayer'

const App: FC = () => {
  const [machineState, machineService] = useMachine(gameMachine)

  return (
    <CurrentPlayerContext.Provider value={machineState.context.currentPlayer}>
      <div className="gameStatus">
        <span>ROUND {machineState.context.round}</span>
        <span>{machineState.context.currentPlayer}'s TURN</span>
        {machineState.context.winner && <span>{machineState.context.winner} HAS WON!</span>}
        {machineState.context.draw && <span>IT'S A DRAW!</span>}
      </div>

      <Board
        machineState={machineState}
        machineService={machineService} />
    </CurrentPlayerContext.Provider>
  );
}

export default App;
