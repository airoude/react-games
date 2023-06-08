import MovingSprite from './MovingSprite';
import Ghost from './Ghost';

export default class PacMan extends MovingSprite<PacMan> implements IEdible {
  constructor() {
    super('PACMAN', 490, 200);
  }

  canBeEaten(): boolean {
    return true;
  }

  canEat(sprite: ISprite): boolean {
    if (sprite instanceof Ghost && sprite.canBeEaten()) {
      return false;
    }

    return !['WALL', 'GHOST_LAIR', 'EMPTY'].includes(sprite.name);
  }
}
