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

import { createGhosts } from './create-ghosts';
import { getGhostStates } from './get-ghost-states';
import { nextGhosts } from './next-ghosts';

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

describe('getGhostStates', () => {
  it('should show only the ghosts whose run is still going when another has played out', () => {
    const ghosts = nextGhosts(
      createGhosts([createWalk(10), createWalk(600)], [LEVEL], 0),
      20,
      constant(0),
    );

    expect(getGhostStates(ghosts, 0)).toHaveLength(1);
  });

  it('should draw the ghost part-way between its steps when it is asked for mid-step', () => {
    const ghosts = nextGhosts(
      createGhosts([createWalk(60)], [LEVEL], 0),
      30,
      constant(0),
    );

    const [back] = getGhostStates(ghosts, 0);
    const [middle] = getGhostStates(ghosts, 0.5);
    const [front] = getGhostStates(ghosts, 1);

    expect(back.player.position.x).toBeLessThan(middle.player.position.x);
    expect(middle.player.position.x).toBeLessThan(front.player.position.x);
    expect(middle.player.position.x).toBeCloseTo(
      (back.player.position.x + front.player.position.x) / 2,
      6,
    );
  });

  it('should show nothing when every run has played out', () => {
    const ghosts = nextGhosts(
      createGhosts([createWalk(10), createWalk(20)], [LEVEL], 0),
      600,
      constant(0),
    );

    expect(getGhostStates(ghosts, 0)).toEqual([]);
  });

  it('should have no ghosts to show when the world has no other runs', () => {
    expect(getGhostStates([], 0)).toEqual([]);
  });
});
