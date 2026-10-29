import {
  createPlayback,
  type GameLevel,
  type Replay,
  type ReplayPlayback,
} from '@mander/engine';
import { type Tile, TILE_AIR } from '@mander/model';
import { constant, times } from 'lodash-es';
import { describe, expect, it } from 'vitest';

import { createStartState } from '../create-start-state';
import { createFrameAfterStep } from './create-frame-after-step';

const LEVEL: GameLevel = {
  seed: 'RUN',
  width: 4,
  height: 4,
  tiles: times(4, (): Tile[] => times(4, constant(TILE_AIR))),
  chestItems: [],
  hornedEnemyChance: 0,
  shooterEnemyChance: 0,
};

const RECORDING: Replay = { worldName: 'ABC', steps: 10, entries: [] };

const createStartPlayback = (): ReplayPlayback =>
  createPlayback(createStartState([LEVEL], 0));

describe('createFrameAfterStep', () => {
  it('should move the playback on by one step', () => {
    expect(
      createFrameAfterStep(RECORDING, createStartPlayback(), constant(0))
        .playback.step,
    ).toBe(1);
  });

  it('should keep the state from before the step when it moves on', () => {
    const before = createStartPlayback();

    expect(createFrameAfterStep(RECORDING, before, constant(0)).previous).toBe(
      before.state,
    );
  });

  it('should keep the playback where it is when the recording has no steps', () => {
    const before = createStartPlayback();

    expect(
      createFrameAfterStep(
        { worldName: 'ABC', steps: 0, entries: [] },
        before,
        constant(0),
      ).playback,
    ).toBe(before);
  });
});
