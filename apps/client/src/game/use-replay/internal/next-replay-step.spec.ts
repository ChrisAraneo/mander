import {
  type Action,
  addRecordedAction,
  createRecorder,
  type GameLevel,
  type Replay,
  toReplay,
  createPlayback,
} from '@mander/engine';
import { type Tile, TILE_AIR, TILE_DIRT, TILE_SPAWN } from '@mander/model';
import { constant, map, reduce, split, times } from 'lodash-es';
import { describe, expect, it } from 'vitest';

import { createStartState } from '../create-start-state';
import type { PlaybackFrame } from '../types/playback-frame';
import { createGhosts } from './create-ghosts';
import { createPlaybackStartFrame } from './create-playback-start-frame';
import { nextReplayStep } from './next-replay-step';

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
  freezingEnemyChance: 0,
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

const createStartFrame = (): PlaybackFrame =>
  createPlaybackStartFrame(createPlayback(createStartState([LEVEL], 0)));

describe('nextReplayStep', () => {
  it('should move the watched run on by the steps it is given', () => {
    expect(
      nextReplayStep(
        createWalk(60),
        createStartFrame(),
        [],
        5,
        0.5,
        constant(0),
      ).frame.playback.step,
    ).toBe(5);
  });

  it('should move the ghosts on by the same steps', () => {
    const [ghost] = nextReplayStep(
      createWalk(60),
      createStartFrame(),
      createGhosts([createWalk(60)], [LEVEL], 0),
      5,
      0.5,
      constant(0),
    ).ghosts;

    expect(ghost.playback.step).toBe(5);
  });

  it('should keep how far into the next step the frame lands', () => {
    expect(
      nextReplayStep(
        createWalk(60),
        createStartFrame(),
        [],
        1,
        0.25,
        constant(0),
      ).alpha,
    ).toBe(0.25);
  });
});
