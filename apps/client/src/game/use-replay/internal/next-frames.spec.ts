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
import { createPlaybackStartFrame } from './create-playback-start-frame';
import { nextFrames } from './next-frames';

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

const createStartFrame = (): PlaybackFrame =>
  createPlaybackStartFrame(createPlayback(createStartState([LEVEL], 0)));

describe('nextFrames', () => {
  it('should move the playback on by the steps it is given', () => {
    expect(
      nextFrames(createWalk(60), createStartFrame(), 5, constant(0)).playback
        .step,
    ).toBe(5);
  });

  it('should keep the state one step back when it moves the playback on', () => {
    const frame = nextFrames(
      createWalk(60),
      createStartFrame(),
      5,
      constant(0),
    );

    expect(frame.previous).toEqual(
      nextFrames(createWalk(60), createStartFrame(), 4, constant(0)).playback
        .state,
    );
  });

  it('should keep the frame as it is when no step is taken', () => {
    const frame = createStartFrame();

    expect(nextFrames(createWalk(60), frame, 0, constant(0))).toBe(frame);
  });

  it('should not change the old frame when it moves the playback on', () => {
    const frame = createStartFrame();

    nextFrames(createWalk(60), frame, 5, constant(0));

    expect(frame).toEqual(createStartFrame());
  });
});
