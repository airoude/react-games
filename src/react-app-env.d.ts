/// <reference types="react-scripts" />

type Player = 'o' | 'x'
type TilesMap = Map<number, Player | null>

interface GameContext {
  winner: string | undefined;
  draw: boolean | undefined;
  round: number;
  currentPlayer: Player;
  tiles: TilesMap;
}

interface GameStateSchema {
  states: {
    playing: {};
    winner: {};
    draw: {};
  }
}

type States = 'playing' | 'winner' | 'draw'
type GameEvent =
  | { type: 'reset' }
  | { type: 'selectTile', tileId: number }
