import { ActorRef } from 'xstate';

export type MovementDirection = 'LEFT' | 'RIGHT' | 'UP' | 'DOWN';
export type GhostName = 'PINKY' | 'BLINKY' | 'INKY' | 'CLYDE';
export type TileSprite = 'DOT' | 'WALL' | 'GHOST_LAIR' | 'POWER_PELLET' | 'EMPTY';
export type MovingSprites = GhostName | 'PACMAN'
export type Sprites = TileSprite | MovingSprites

export interface IEdible {
  canEat(sprite: ISprite): boolean;
  canBeEaten(): boolean;
}

export interface ISprite {
  readonly name: Sprites;
  readonly asset: string;
}

export interface IGhost extends ISprite, IEdible {
}

export interface IFood extends ISprite, IEdible {
}

export interface IDot extends IFood {}

export interface IPowerPellet extends IFood {}

export interface IMovingSprite extends ISprite {
  readonly name: MovingSprites;
  readonly speed: number;

  move(position: number): IMovingSprite;
  currentPosition(): number;
  samePosition(position: number): boolean;
}

export type PacmanContext = {
  score: number;
  pacMan: IMovingSprite | undefined;
  ghosts: IGhost[];
  ghostHandler: ActorRef<any>;
  layout: number[];
  timerId?: undefined;
}

export type PacmanStateEvents =
  | { type: 'MOVE_PACMAN', direction: MovementDirection }
  | { type: 'EAT', sprite: IEdible }
