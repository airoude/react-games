import React, { FC } from 'react'
import cn from 'classnames'
import { State } from 'xstate'
import { PLAYER_O, PLAYER_X } from 'consts'
import Cell from './Cell'
import './Board.css'

interface BoardProps {
  state: State<GameContext, GameEvent>;
  selectTile: (tileId: number) => void;
}

const Board: FC<BoardProps> = ({ state, selectTile }) => (
  <div className={cn('board', {
    'x-turn': state.context.currentPlayer === PLAYER_X,
    'o-turn': state.context.currentPlayer === PLAYER_O,
  })}>
    {Array.from(state.context.tiles.entries()).map(([ tileId, takenByPlayer ]) => (
      <Cell
        key={tileId}
        id={tileId}
        takenBy={takenByPlayer}
        selectTile={() => selectTile(tileId)} />
    ))}
  </div>
)

export default Board
