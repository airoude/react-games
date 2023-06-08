import * as React from 'react';
import { createActorContext, useActor } from '@xstate/react';
import { createMachine, assign, fromCallback } from 'xstate';
import useKeyPress from '@/hooks/useKeyPress';
import { Direction } from './consts';
import Board from './components/Board';
import { isDev } from 'utils';
import * as c from 'games/pacman/consts';
import Ghost from 'games/pacman/Ghost';
import PacMan from 'games/pacman/PacMan';
import { MovementDirection } from '@/games/pacman/types';

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

const machine = createMachine({
  types: {
    context: {} as IPacmanStateContext,
    events: {} as IPacmanMachineEvents
  },
  context: {
    state: c.GameState.ACTIVE,
    score: 0,
    pacMan: undefined,
    ghosts: [],
    ghostHandler: undefined,
    layout: c.MapLayout
  },
  initial: 'playing',
  entry: [
    // does this only the first time
    { actions: 'spawnGhosts', guard: 'canSpawnGhost' },
    { actions: 'spawnPacMan', guard: 'canSpawnPacMan' }
  ],
  invoke: [
    {
      id: 'raf',
      src: fromCallback(sendBack => {
        const fn = () => {
          sendBack({ type: 'tick' });
          
          requestAnimationFrame(fn);
        }
        
        requestAnimationFrame(fn);
      })
    }
  ],
  states: {
    playing: {
      always: [
        { target: 'win', guard: 'checkWin' },
        { target: 'lose', guard: 'checkLose' }
      ],
      on: {
        MOVE_PACMAN: {
          target: 'playing',
          actions: ['movePacman', 'eat'],
          guard: 'canMove'
        }
      }
    },
    win: {},
    lose: {}
  }
}, {
  actions: {
    stopGhosts: assign(({ context }) => {
      context.ghostHandler.stop();
      
      return {
        ghostHandler: undefined
      };
    }),
    spawnGhosts: assign(({ context }) => ({
      ghostHandler: spawn(() => {
        context.ghosts = [
          new Ghost(c.Ghosts.BLINKY, 348, 250),
          new Ghost(c.Ghosts.PINKY, 376, 400),
          new Ghost(c.Ghosts.INKY, 351, 300),
          new Ghost(c.Ghosts.CLYDE, 379, 500)
        ];
        
        // ctx.ghosts.forEach((ghost, i) => {
        //   ghost.timerId = setInterval(() => {
        //     let nextPosition = getNextMovementTileId(ghost.currentPosition, getRandomDirectionMovement());
        //     while (isTileType(nextPosition, ctx.layout, c.TileSprites.WALL)) {
        //       nextPosition = getNextMovementTileId(ghost.currentPosition, getRandomDirectionMovement());
        //     }
        //   }, ghost.speed * 10);
        // });
        
        return () => {
          context.ghosts.forEach(ghost => {
            if (ghost.timerId) {
              // @ts-ignore
              clearInterval(ghost.timerId);
              ghost.timerId = undefined;
            }
          });
        };
      })
    })),
    spawnPacMan: assign(() => ({
      pacMan: new PacMan()
    })),
    movePacman: assign(({ context, event }) => {
      if (context.pacMan) {
        context.pacMan.move(getNextMovementTileId(context.pacMan.currentPosition(), event.direction));
      }
    }),
    eat: assign(({ context }) => {
      if (!context.pacMan) {
        return;
      }
      
      const tileType = getTileType(context.pacMan.currentPosition(), context.layout);
      if (undefined !== tileType) {
        if ([c.TileSprites.DOT, c.TileSprites.POWER_PELLET].includes(tileType)) {
          context.layout.splice(context.pacMan.currentPosition(), 1, c.TileSprites.EMPTY);
        }
        
        if (tileType === c.TileSprites.DOT) {
          context.score = context.score + 1;
        }
        
        if (tileType === c.TileSprites.POWER_PELLET) {
          context.score = context.score + 10;
        }
      }
      
      const isPacmanOnGhost = context
      .ghosts
      .filter(ghost => {
        if (!ghost.isScared) {
          return false;
        }
        
        // @ts-ignore
        if (ghost.samePosition(ctx.pacMan)) {
          return true;
        }
      })
      .shift();
      
      if (undefined !== isPacmanOnGhost) {
        context.score = context.score + 100;
      }

      context.ghosts.forEach(ghost => {
        if (tileType === c.TileSprites.POWER_PELLET) {
          ghost.scare();
        }
        
        // @ts-ignore
        if (ghost.canBeEaten() && ghost.samePosition(ctx.pacMan)) {
          ghost.move(348);
        }
      });
    })
  },
  guards: {
    checkWin: ({ context }) => context.score === 274,
    checkLose: ({ context }) => context.ghosts.some(ghost => ghost.canEat(context.pacMan)),
    canSpawnGhost: ({ context }) => typeof context.ghostHandler !== undefined,
    canSpawnPacMan: ({ context }) => typeof context.pacMan !== undefined,
    canMove: ({ context, event }) => {
      const nextId = getNextMovementTileId(context.pacMan.currentPosition(), event.direction);
      const tileType = getTileType(nextId, context.layout);
      
      // out of bounds
      if (undefined === tileType) {
        return false;
      }
      
      return [c.TileSprites.DOT, c.TileSprites.POWER_PELLET, c.TileSprites.EMPTY].includes(tileType);
    },
  }
});

export const PacmanContext = createActorContext(machine);

export const Game: React.FC = () => {
  const [state, send] = useActor(machine, { devTools: isDev() });
  
  useKeyPress([
    {
      keys: ['ArrowUp', 'w'],
      fn: () => send({ type: 'MOVE_PACMAN', direction: Direction.UP })
    },
    {
      keys: ['ArrowDown', 's'],
      fn: () => send({ type: 'MOVE_PACMAN', direction: Direction.DOWN })
    },
    {
      keys: ['ArrowLeft', 'a'],
      fn: () => send({ type: 'MOVE_PACMAN', direction: Direction.LEFT })
    },
    {
      keys: ['ArrowRight', 'd'],
      fn: () => send({ type: 'MOVE_PACMAN', direction: Direction.RIGHT })
    },
    {
      keys: [' '],
      fn: () => send({ type: 'PAUSE_GAME' })
    }
  ]);
  
  const onKeyPress = React.useCallback(
    (e: KeyboardEvent) => {
      switch (e.key) {
        // up
        case 'ArrowUp':
        case 'w':
          send({ type: 'MOVE_PACMAN', direction: Direction.UP });
          break;
        
        // down
        case 'ArrowDown':
        case 's':
          send({ type: 'MOVE_PACMAN', direction: Direction.DOWN });
          break;
        
        // left
        case 'ArrowLeft':
        case 'a':
          send({ type: 'MOVE_PACMAN', direction: Direction.LEFT });
          break;
        
        // right
        case 'ArrowRight':
        case 'd':
          send({ type: 'MOVE_PACMAN', direction: Direction.RIGHT });
          break;
        
        // space
        case ' ':
          send({ type: 'PAUSE_GAME' });
          break;
      }
    },
    []
  );
  
  React.useEffect(() => {
    window.addEventListener('keydown', onKeyPress);
    
    return () => {
      window.removeEventListener('keydown', onKeyPress);
    };
  }, []);
  
  return (
    <PacmanContext.Provider machine={machine}>
      <Board />
    </PacmanContext.Provider>
  );
};
