import * as React from 'react'
import cn from 'clsx'
import { Cell } from './Cell'
import { TicTacToeContext } from '../Game.tsx';
import { Player, TicTacToeEvents } from '../types.ts';
import { Button } from './Button.tsx';
import Message from './Message.tsx';
import { Overlay } from './Overlay.tsx';
import styles from './Board.module.css'

export const Board: React.FC = () => {
  const { send } = TicTacToeContext.useActorRef();
  const { currentPlayer, tiles, winner, isDraw } = TicTacToeContext.useSelector(state => ({
    tiles: state.context.tiles,
    currentPlayer: state.context.currentPlayer,
    winner: state.context.winner,
    isDraw: state.hasTag('draw'),
  }));

  return (
    <>
      {(winner || isDraw) && (
        <Overlay>
          <Message style={{ marginBottom: 64 }} type={undefined === winner ? 'primary' : 'success'}>
            {isDraw && <span aria-label="Draw">IT'S A DRAW</span>}
            {winner && (
              <span aria-label="Winner">
              <b>{winner.toUpperCase()}</b> HAS WON
            </span>
            )}
          </Message>

          <Button size="lg" onClick={() => send({ type: TicTacToeEvents.Reset })}>
            Replay
          </Button>
        </Overlay>
      )}

      <div
        className={cn(styles.board, {
          [styles['x-turn']]: currentPlayer === Player.X,
          [styles['o-turn']]: currentPlayer === Player.O,
        })}
      >
        {tiles.map((takenByPlayer, tileId) => (
          <Cell
            key={tileId}
            id={tileId}
            takenBy={takenByPlayer}
          />
        ))}
      </div>
    </>
  )
}
