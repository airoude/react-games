import * as React from 'react'
import cn from 'clsx'
import { SnakeContext } from '../Game.tsx';
import { SnakeEvents } from '../types.ts';
import styles from './Board.module.css'

export const Board: React.FC = () => {
  const { send } = SnakeContext.useActorRef();

  return (
    <div>
      Snaaaaaaaaaaaaaake
    </div>
  )
}
