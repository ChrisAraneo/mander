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

const computeStartX = (): number =>
  createStartState([LEVEL], 0).player.position.x;

describe('nextGhosts', () => {
  it('should walk the ghost forward when its own recording is stepped on', () => {
    const [ghost] = nextGhosts(
      createGhosts([createWalk(60)], [LEVEL], 0),
      30,
      constant(0),
    );

    expect(ghost.playback.state.player.position.x).toBeGreaterThan(
      computeStartX(),
    );
  });

  it('should keep the state one step back when it walks a ghost forward', () => {
    const [ghost] = nextGhosts(
      createGhosts([createWalk(60)], [LEVEL], 0),
      30,
      constant(0),
    );

    expect(ghost.previous.player.position.x).toBeLessThan(
      ghost.playback.state.player.position.x,
    );
  });

  it('should land on the same place when the steps come one at a time rather than in one batch', () => {
    const [batched] = nextGhosts(
      createGhosts([createWalk(60)], [LEVEL], 0),
      40,
      constant(0),
    );
    const [dripped] = reduce(
      times(40),
      (ghosts) => nextGhosts(ghosts, 1, constant(0)),
      createGhosts([createWalk(60)], [LEVEL], 0),
    );

    expect(dripped.playback.state.player.position.x).toBe(
      batched.playback.state.player.position.x,
    );
  });

  it('should hold the ghost still when its run has played out', () => {
    const ghosts = nextGhosts(
      createGhosts([createWalk(10)], [LEVEL], 0),
      600,
      constant(0),
    );

    expect(nextGhosts(ghosts, 600, constant(0))[0]).toBe(ghosts[0]);
  });

  it('should keep the ghost where it is when no step is taken', () => {
    const ghosts = createGhosts([createWalk(10)], [LEVEL], 0);

    expect(nextGhosts(ghosts, 0, constant(0))[0].playback).toBe(
      ghosts[0].playback,
    );
  });

  it('should have no ghosts to move when the world has no other runs', () => {
    expect(nextGhosts([], 30, constant(0))).toEqual([]);
  });
});
