/// <reference types="react-scripts" />

type Player = 'o' | 'x'
type TilesMap = Map<number, Player | null>

interface TicTacToeStateContext {
  winner: string | undefined;
  draw: boolean | undefined;
  round: number;
  currentPlayer: Player;
  tiles: TilesMap;
}

interface TicTacToeStateSchema {
  states: {
    playing: {};
    winner: {};
    draw: {};
  }
}

type TicTacToeStates = 'playing' | 'winner' | 'draw'
type TicTacToeStateEvent =
  | { type: 'reset' }
  | { type: 'selectTile', tileId: number };


////////////////////////
//////// PACMAN ////////
////////////////////////
type MovementDirection = 'LEFT' | 'RIGHT' | 'UP' | 'DOWN';
type GhostType = 'PINKY' | 'BLINKY' | 'INKY' | 'CLYDE';
type TileSprite = 'DOT' | 'WALL' | 'GHOST_LAIR' | 'POWER_PELLET' | 'EMPTY';
type PacmanStates = 'WIN' | 'LOSE' | 'ACTIVE' | 'PAUSED'

type Pacman = {
  position: number;
  speed: number;
}

type Ghost = {
  timerId?: NodeJS.Timeout;
  name: GhostType;
  isScared: boolean;
  position: number;
  speed: number;
}

interface PacmanStateContext {
  score: number;
  state: PacmanStates;
  pacman: Pacman;
  ghosts: Ghost[];
  layout: number[];
}

interface PacmanStateSchema {
  states: {
    idle: {};
    win: {};
    gameOver: {};
  }
}

type PacmanPauseEvent = { type: 'PAUSE_GAME' };
type PacmanMovePacmanEvent = { type: 'MOVE_PACMAN', direction: MovementDirection };
type PacmanMoveGhostEvent = { type: 'MOVE_GHOST', direction: MovementDirection, ghost: Ghost };
type PacmanStateEvent =
  | PacmanPauseEvent
  | PacmanMovePacmanEvent
  | PacmanMoveGhostEvent;
