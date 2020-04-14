import React, { FC } from 'react'
import cn from 'classnames'

interface CellProps {
  id: number;
  selectTile: (tileId: number) => void;
  takenBy?: string | null;
}

const Cell: FC<CellProps> = ({ id, selectTile, takenBy }) => (
  <div
    onClick={() => selectTile(id)}
    className={cn('cell', takenBy)} />
)

export default Cell
