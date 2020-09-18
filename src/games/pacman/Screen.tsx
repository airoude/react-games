import React, { FC, useEffect } from 'react';
import { useMachine } from '@xstate/react/lib';
import { inspect } from '@xstate/inspect';
import cn from 'classnames';
import gameMachine from 'states/pacman';
import { Direction } from 'games/pacman/consts';
import Board from 'games/pacman/components/Board';
import Score from 'games/pacman/components/Score';
import styles from '__styles/pacman.module.css';

inspect({
  url: 'https://statecharts.io/inspect',
  iframe: false
});

const Screen: FC = () => {
  const [state, send] = useMachine(gameMachine);

  useEffect(() => {
    const onKeyPress = (e: KeyboardEvent) => {
      switch (e.key) {
        // up
        case 'ArrowUp':
        case 'w':
          send({ type: 'MOVE_PACMAN', direction: Direction.UP });
          break;

        // down
        case 'ArrowDown':
        case 's':
          send({ type: 'MOVE_PACMAN', direction: Direction.DOWN });
          break;

        // left
        case 'ArrowLeft':
        case 'a':
          send({ type: 'MOVE_PACMAN', direction: Direction.LEFT });
          break;

        // right
        case 'ArrowRight':
        case 'd':
          send({ type: 'MOVE_PACMAN', direction: Direction.RIGHT });
          break;

        // space
        case ' ':
          send({ type: 'PAUSE_GAME' });
          break;
      }
    };

    window.addEventListener('keydown', onKeyPress);

    return () => {
      window.removeEventListener('keydown', onKeyPress);
    };
  }, [send]);

  return (
    <div
      className={cn(styles.container, {
        paused: state.context.state === 'PAUSED'
      })}
    >
      <Board state={state} />
      <Score score={state.context.score} />
    </div>
  );
};

export default Screen;
