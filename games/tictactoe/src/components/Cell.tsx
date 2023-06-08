import * as React from 'react'
import cn from 'clsx'
import { TicTacToeContext } from '../Game.tsx';
import { TicTacToeEvents } from '../types.ts';
import styles from './Board.module.css'

type CellProps = {
  id: number;
  takenBy?: string | null;
}

export const Cell = ({ id, takenBy }: CellProps) => {
  const { send } = TicTacToeContext.useActorRef();

  return (
    <div
      data-tile-id={id}
      data-taken-by={takenBy}
      className={cn(styles.cell, {
        // @ts-expect-error aaaa
        [styles[takenBy]]: undefined !== takenBy,
      })}
      onClick={() => send({ type: TicTacToeEvents.SelectTile, tileId: id })}
    />
  );
}
