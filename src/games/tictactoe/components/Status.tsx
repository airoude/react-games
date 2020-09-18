import React, { FC } from 'react'
import { useCurrentGame } from 'games/tictactoe/contexts/currentGame'
import styles from './Status.module.css'

const Status: FC = () => {
  const ctx = useCurrentGame()

  return (
    <div className={styles.status}>
      <span>ROUND {ctx.round}</span>
      <span>{ctx.currentPlayer}'s TURN</span>
    </div>
  )
}

export default Status
