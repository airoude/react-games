export enum Player {
  O = 'o',
  X = 'x',
}

export enum TicTacToeEvents {
  SelectTile = 'selectTile',
  Reset = 'reset',
}

export type TicTacToeStateContext = {
  winner: Player | undefined,
  currentPlayer: Player;
  moves: number;
  tiles: Array<Player | null>;
}

export type TicTacToeMachineEvents =
  | { type: TicTacToeEvents.SelectTile; tileId: number }
  | { type: TicTacToeEvents.Reset }
