import * as React from 'react'
import { TileSprites } from 'games/pacman/consts'
import Dot from './sprites/Dot'
import Wall from './sprites/Wall'
import Lair from './sprites/Lair'
import PowerPellet from './sprites/PowerPellet'
import EmptySpace from './sprites/EmptySpace'
import Pacman from './sprites/Pacman'
import Ghost from './sprites/Ghost'
import Score from '@/games/pacman/components/Score';
import { PacmanContext } from '@/games/pacman/Game';
import styles from './Board.module.css'

const Board: React.FC = () => {
  const layout = PacmanContext.useSelector(state => state.context.layout);
  const pacMan = PacmanContext.useSelector(state => state.context.pacMan);
  const ghosts = PacmanContext.useSelector(state => state.context.ghosts);
  
  return (
    <>
      <Score />
      
      <div className={styles.grid}>
        {layout.map((gridValue, idx) => {
          if (pacMan && pacMan.samePosition(idx)) {
            return <Pacman key={idx} />;
          }

          const ghost = ghosts.find(ghost => ghost.samePosition(idx));
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
    </>
  );
}

export default Board;
