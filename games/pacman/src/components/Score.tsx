import * as React from 'react';
import { PacmanContext } from '@/games/pacman/Game';

const Score: React.FC = () => {
  const score = PacmanContext.useSelector(state => state.context.score);
  
  return (
    <span className="">Score: {score}</span>
  );
}

export default Score
