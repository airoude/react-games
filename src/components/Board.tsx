import React, { FC } from 'react'
import cn from 'classnames'
import { CurrentPlayerContext } from '../contexts/currentPlayer'
import gameMachine, { checkDraw, checkWinner, states } from '../state/game'
import Cell from './Cell'
import { useMachine } from '../state/useMachine'
import { PLAYER_O, PLAYER_X } from '../constants'
import './Board.css'

const Board: FC = () => {
  const [machineState, machineService] = useMachine(gameMachine)

  const onSelectTile = (tileId: number) => {
    machineService.send(states.SELECT_TILE, { tileId })

    if (checkWinner(machineState.context.selectedTiles, machineState.context.currentPlayer)) {
      machineService.send(states.WINNER, { winner: machineState.context.currentPlayer })
    } else if (checkDraw(machineState.context.selectedTiles)) {
      machineService.send(states.DRAW, { winner: false })
    } else {
      machineService.send(states.NEXT_ROUND)
    }
  }

  return (
    <CurrentPlayerContext.Provider value={machineState.context.currentPlayer}>
      <div className="gameStatus">
        <span>ROUND {machineState.context.round}</span>
        <span>{machineState.context.currentPlayer}'s TURN</span>
        {machineState.context.winner && <span>{machineState.context.winner} HAS WON!</span>}
        {false === machineState.context.winner && <span>IT'S A DRAW!</span>}
        {machineState.matches(states.END_GAME) && <button onClick={() => machineService.start()}>
          RESTART
        </button>}
      </div>

      <div className={cn('board', {
        'x-active': machineState.context?.currentPlayer === PLAYER_X,
        'o-active': machineState.context?.currentPlayer === PLAYER_O,
        'finished': machineState.matches(states.END_GAME)
      })}>
        {Array.from(Array(9).keys()).map((tileId) => (
          <Cell
            key={tileId}
            id={tileId}
            takenBy={machineState.context?.selectedTiles.get(tileId)}
            onSelect={() => onSelectTile(tileId)} />
        ))}
      </div>
    </CurrentPlayerContext.Provider>
  )
}

export default Board
