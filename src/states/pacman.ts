import { Machine } from 'xstate';
import { MachineConfig, MachineOptions } from 'xstate/lib/types';
import { assign } from '@xstate/immer';
import * as c from 'games/pacman/consts';

const getNextMovementTileId = (currentIdx: number, direction: MovementDirection): number => {
  if (direction === c.Direction.LEFT) {
    return currentIdx - 1 === 363 ? 391 : currentIdx - 1; // teleport to the otherside
  }

  if (direction === c.Direction.RIGHT) {
    return currentIdx + 1 === 392 ? 364 : currentIdx + 1; // teleport to the otherside
  }

  if (direction === c.Direction.UP) {
    return currentIdx - c.GridWidth;
  }

  if (direction === c.Direction.DOWN) {
    return currentIdx + c.GridWidth;
  }

  // well we can't go anywhere..
  return currentIdx;
};
const getTileType = (tileId: number, layout: number[]) => layout.find((tileType, tileIdx) => tileIdx === tileId);
const isTileType = (tileId: number, layout: number[], tileType: number) => getTileType(tileId, layout) === tileType;
const possibleDirections = [-1, +1, c.GridWidth, -c.GridWidth];
const getRandomDirection = () => possibleDirections[Math.floor(Math.random() * possibleDirections.length)];
const getRandomDirectionMovement = () => {
  const directions = Object.keys(c.Direction);
  const i = Math.floor(Math.random() * directions.length);

  return directions[i] as MovementDirection;
};

const initialContext: PacmanStateContext = {
  state: c.GameState.ACTIVE,
  score: 0,
  pacman: {
    position: 490,
    speed: 200
  },
  ghosts: [
    { name: c.Ghosts.BLINKY, isScared: false, position: 348, speed: 250 },
    { name: c.Ghosts.PINKY, isScared: false, position: 376, speed: 400 },
    { name: c.Ghosts.INKY, isScared: false, position: 351, speed: 300 },
    { name: c.Ghosts.CLYDE, isScared: false, position: 379, speed: 500 }
  ],
  layout: c.MapLayout
};

const config: MachineConfig<PacmanStateContext, PacmanStateSchema, PacmanStateEvent> = {
  initial: 'idle',
  activities: ['moveGhosts'],
  states: {
    idle: {
      always: [
        { target: 'win', cond: 'checkWin' },
        { target: 'gameOver', cond: 'checkGameOver' }
      ],
      on: {
        MOVE_PACMAN: {
          target: 'idle',
          actions: ['movePacman', 'eat'],
          cond: 'canMove'
        }
      }
    },
    win: {
      entry: 'setWin'
    },
    gameOver: {
      entry: 'setGameOver'
    }
  }
};

const options: MachineOptions<PacmanStateContext, PacmanStateEvent> = {
  delays: {},
  services: {},
  activities: {
    moveGhosts: (ctx) => {
      ctx.ghosts.forEach((ghost, i) => {
        ghost.timerId = setInterval(() => {
          let nextPosition = getNextMovementTileId(ghost.position, getRandomDirectionMovement());
          while (isTileType(nextPosition, ctx.layout, c.TileSprites.WALL)) {
            nextPosition = getNextMovementTileId(ghost.position, getRandomDirectionMovement());
          }
        }, ghost.speed * 10);
      });

      return () => {
        ctx.ghosts.forEach((ghost) => {
          if (ghost.timerId) {
            clearInterval(ghost.timerId);
            ghost.timerId = undefined;
          }
        });
      };
    }
  },
  actions: {
    // @ts-ignore
    moveGhost: assign<PacmanStateContext, PacmanMoveGhostEvent>((ctx, e) => {
      const ghost = ctx.ghosts.find((g) => g.name === e.ghost.name);
      if (ghost) {
        ghost.position = getNextMovementTileId(e.ghost.position, e.direction);
      }
    }),
    // @ts-ignore
    movePacman: assign<PacmanStateContext, PacmanMovePacmanEvent>((ctx, e) => {
      ctx.pacman.position = getNextMovementTileId(ctx.pacman.position, e.direction);
    }),
    eat: assign((ctx) => {
      const tileType = getTileType(ctx.pacman.position, ctx.layout);
      if (undefined !== tileType) {
        if ([c.TileSprites.DOT, c.TileSprites.POWER_PELLET].includes(tileType)) {
          ctx.layout.splice(ctx.pacman.position, 1, c.TileSprites.EMPTY);
        }

        if (tileType === c.TileSprites.DOT) {
          ctx.score = ctx.score + 1;
        }

        if (tileType === c.TileSprites.POWER_PELLET) {
          ctx.score = ctx.score + 10;
        }
      }

      const isPacmanOnGhost = ctx.ghosts
        .filter((ghost) => {
          if (!ghost.isScared) {
            return false;
          }

          if (ghost.position === ctx.pacman.position) {
            return true;
          }
        })
        .shift();

      if (undefined !== isPacmanOnGhost) {
        ctx.score = ctx.score + 100;
      }

      ctx.ghosts.forEach((ghost) => {
        if (tileType === c.TileSprites.POWER_PELLET) {
          ghost.isScared = true;
        }

        if (ghost.isScared && ghost.position === ctx.pacman.position) {
          ghost.position = 348; // @todo make initial position
        }
      });
    }),
    cleanup: assign((ctx, e) => {
      ctx.ghosts.forEach((ghost) => {
        if (ghost.timerId) {
          // @ts-ignore
          clearInterval(ghost.timerId);
          ghost.timerId = undefined;
        }
      });
    }),
    setWin: assign((ctx) => (ctx.state = c.GameState.WIN)),
    setGameOver: assign((ctx) => (ctx.state = c.GameState.LOSE))
  },
  guards: {
    canMove: (ctx, e) => {
      // @ts-ignore
      const nextId = getNextMovementTileId(ctx.pacman.position, e.direction);
      const tileType = getTileType(nextId, ctx.layout);
      // out of bounds
      if (undefined === tileType) {
        return false;
      }

      return [c.TileSprites.DOT, c.TileSprites.POWER_PELLET, c.TileSprites.EMPTY].includes(tileType);
    },
    checkWin: (ctx) => ctx.score === 274,
    checkGameOver: (ctx) => ctx.ghosts.some((ghost) => !ghost.isScared && ghost.position === ctx.pacman.position)
  }
};

export default Machine<PacmanStateContext, PacmanStateSchema, PacmanStateEvent>(config, options, initialContext);
