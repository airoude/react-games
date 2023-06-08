export enum SnakeEvents {
  Reset = 'reset',
}

export type SnakeStateContext = {
}

export type SnakeMachineEvents =
  | { type: SnakeEvents.Reset }
