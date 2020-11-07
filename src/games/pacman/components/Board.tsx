import React, { FC } from 'react';
import { State } from 'xstate';
import { TileSprites } from 'games/pacman/consts';
import Dot from './sprites/Dot';
import Wall from './sprites/Wall';
import Lair from './sprites/Lair';
import PowerPellet from './sprites/PowerPellet';
import EmptySpace from './sprites/EmptySpace';
import Pacman from './sprites/Pacman';
import Ghost from './sprites/Ghost';
import styles from './Board.module.css';

interface BoardProps {
  state: State<PacmanStateContext, PacmanStateEvent, PacmanStateSchema>;
}

const Board: FC<BoardProps> = ({ state }) => (
  <div className={styles.grid}>
    {state.context.layout.map((gridValue, idx) => {
      if (idx === state.context.pacman.position) {
        return <Pacman key={idx} />;
      }

      const ghost = state.context.ghosts.find(ghost => ghost.position === idx);
      if (ghost) {
        return (
          <Ghost
            key={idx}
            name={ghost.name}
            isScared={ghost.isScared}
          />
        )
      }

      switch (gridValue) {
        case TileSprites.DOT:          return <Dot key={idx} />;
        case TileSprites.WALL:         return <Wall key={idx} />;
        case TileSprites.GHOST_LAIR:   return <Lair key={idx} />;
        case TileSprites.POWER_PELLET: return <PowerPellet key={idx} />;
        case TileSprites.EMPTY:        return <EmptySpace key={idx} />;
      }

      return null;
    })}
  </div>
);

export default Board;
