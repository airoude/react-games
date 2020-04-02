import React, { FC } from 'react'
import cn from 'classnames'

interface CellProps {
  id: number;
  onSelect: () => void;
  takenBy?: string | null;
}

const Cell: FC<CellProps> = ({ id, onSelect, takenBy }) => {
  const classNames = cn('cell', takenBy)

  return (
    <div
      data-cell-id={id}
      className={classNames}
      onClick={onSelect} />
  )
}

export default Cell
