import React, { FC } from 'react'
import { useHover } from '@umijs/hooks'
import cn from 'classnames'
import { useCurrentPlayer } from '../contexts/currentPlayer'

interface CellProps {
  id: number;
  onSelect: () => void;
  takenBy?: string | null;
}

const Cell: FC<CellProps> = ({ id, onSelect, takenBy }) => {
  const currentPlayer = useCurrentPlayer()
  const [isHovering, hoverRef] = useHover<HTMLDivElement>();

  const onClick = () => {
    if (takenBy) {
      return
    }

    onSelect()
  }

  return (
    <div
      data-cell-id={id}
      className={cn('cell', { [currentPlayer]: isHovering }, takenBy)}
      ref={hoverRef}
      onClick={onClick} />
  )
}

export default Cell
