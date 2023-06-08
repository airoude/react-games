import Sprite from './Sprite';
import { IMovingSprite, MovingSprites } from '@/games/pacman/types';

export default class MovingSprite<T> extends Sprite implements IMovingSprite<T> {
  constructor(
    readonly name: MovingSprites,
    private readonly position: number,
    readonly speed: number,
  ) {
    super(name);
  }
  
  move(nextPosition: number): IMovingSprite<T> {
    return new MovingSprite<T>(this.name, nextPosition, this.speed);
  }

  currentPosition(): number {
    return this.position;
  }

  samePosition(position: IMovingSprite<T> | number): boolean {
    if (position instanceof MovingSprite) {
      return this.position === position.currentPosition()
    }

    return this.position === position;
  }
}
