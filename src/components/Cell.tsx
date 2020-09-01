import React, { FC } from 'react'
import cn from 'classnames'

interface CellProps {
  id: number;
  selectTile: () => void;
  takenBy?: string | null;
}

const Cell: FC<CellProps> = ({ id, selectTile, takenBy }) => (
  <div
    data-tile-id={id}
    onClick={selectTile}
    className={cn('cell', takenBy)} />
)

export default Cell
