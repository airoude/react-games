import MovingSprite from './MovingSprite';
import { GhostName, IEdible, IMovingSprite } from '@/games/pacman/types';

export default class Ghost extends MovingSprite<Ghost> implements IEdible {
  constructor (
    readonly name: GhostName,
    readonly position: number,
    readonly speed: number,
    readonly isScared: boolean = false
  ) {
    super(name, position, speed)
  }

  scare = (): Ghost => new Ghost(this.name, this.currentPosition(), this.speed, true)
  unscare = (): Ghost => new Ghost(this.name, this.currentPosition(), this.speed, false)
  canBeEaten = (): boolean => this.isScared;
  canEat = (sprite: IMovingSprite<any>) => !this.isScared && this.samePosition(sprite);
}
