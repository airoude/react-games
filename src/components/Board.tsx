import React, { FC } from 'react'
import cn from 'classnames'
import { Interpreter, State } from 'xstate'
import { checkDraw, checkWinner, GameContext, GameEvents } from 'state/game'
import { PLAYER_O, PLAYER_X, states } from 'consts'
import Cell from './Cell'
import './Board.css'

interface BoardProps {
  machineState: State<GameContext, GameEvents>;
  machineService: Interpreter<GameContext, any, GameEvents>;
}

const Board: FC<BoardProps> = ({ machineState, machineService }) => {
  const onSelectTile = (tileId: number) => {
    machineService.send(states.SELECT_TILE, { tileId })

    if (checkWinner(machineState.context.selectedTiles, machineState.context.currentPlayer)) {
      return machineService.send(states.WINNER)
    }

    if (checkDraw(machineState.context.selectedTiles)) {
      return machineService.send(states.DRAW)
    }

    machineService.send(states.NEXT_ROUND)
  }

  return (
    <div className={cn('board', {
      'x-turn': machineState.context.currentPlayer === PLAYER_X,
      'o-turn': machineState.context.currentPlayer === PLAYER_O,
    })}>
      {Array.from(Array(9).keys()).map((tileId) => (
        <Cell
          key={tileId}
          id={tileId}
          takenBy={machineState.context.selectedTiles.get(tileId)}
          selectTile={onSelectTile} />
      ))}
    </div>
  )
}

export default Board
