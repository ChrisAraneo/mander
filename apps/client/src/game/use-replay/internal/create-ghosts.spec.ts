import {
  type Action,
  addRecordedAction,
  createRecorder,
  type GameLevel,
  type Replay,
  toReplay,
} from '@mander/engine';
import { type Tile, TILE_AIR, TILE_DIRT, TILE_SPAWN } from '@mander/model';
import { constant, map, reduce, split, times } from 'lodash-es';
import { describe, expect, it } from 'vitest';

import { createStartState } from '../create-start-state';
import { createGhosts } from './create-ghosts';

const TILES: Record<string, Tile> = {
  '#': TILE_DIRT,
  S: TILE_SPAWN,
};

const ROWS = [
  '#..................#',
  '#..................#',
  '#..................#',
  '#..................#',
  '#..................#',
  '#..................#',
  '#..................#',
  '#.S................#',
  '#.S................#',
  '####################',
  '####################',
  '####################',
];

const LEVEL: GameLevel = {
  seed: 'GHOST',
  width: 20,
  height: 12,
  tiles: map(ROWS, (row) =>
    map(split(row, ''), (cell) => TILES[cell] ?? TILE_AIR),
  ),
  chestItems: [],
  hornedEnemyChance: 0,
  fastEnemyChance: 0,
  shooterEnemyChance: 0,
};

const TICK: Action = { type: 'TICK' };

const MOVE_RIGHT: Action = { type: 'MOVE_RIGHT_START' };

const createWalk = (steps: number): Replay =>
  toReplay(
    reduce(
      [MOVE_RIGHT, ...times(steps, constant(TICK))],
      addRecordedAction,
      createRecorder('GHOST'),
    ),
  );

describe('createGhosts', () => {
  it('should start every ghost from its own copy of the opening state when the ghosts are created', () => {
    const ghosts = createGhosts([createWalk(30), createWalk(30)], [LEVEL], 0);

    expect(ghosts).toHaveLength(2);
    expect(ghosts[0].playback.state).not.toBe(ghosts[1].playback.state);
    expect(map(ghosts, (ghost) => ghost.playback.state)).toEqual([
      createStartState([LEVEL], 0),
      createStartState([LEVEL], 0),
    ]);
  });

  it('should pair each ghost with its own recording when the ghosts are created', () => {
    const recordings = [createWalk(10), createWalk(20)];

    expect(
      map(createGhosts(recordings, [LEVEL], 0), (ghost) => ghost.recording),
    ).toEqual(recordings);
  });

  it('should start each ghost at the first step with nothing behind it', () => {
    const [ghost] = createGhosts([createWalk(10)], [LEVEL], 0);

    expect(ghost.playback.step).toBe(0);
    expect(ghost.previous).toBe(ghost.playback.state);
  });

  it('should carry the score into the opening state when the run started with one', () => {
    const [ghost] = createGhosts([createWalk(10)], [LEVEL], 450);

    expect(ghost.playback.state.score).toBe(450);
  });

  it('should have no ghosts when the world has no other runs', () => {
    expect(createGhosts([], [LEVEL], 0)).toEqual([]);
  });
});
