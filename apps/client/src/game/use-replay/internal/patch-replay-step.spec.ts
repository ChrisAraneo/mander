import {
  createPlayback,
  type GameLevel,
  type Replay,
  type ReplayPlayback,
} from '@mander/engine';
import { FIXED_STEP_SECONDS, type Tile, TILE_AIR } from '@mander/model';
import type { Palette } from '@mander/render';
import { constant, times } from 'lodash-es';
import { NEVER } from 'rxjs';
import { describe, expect, it } from 'vitest';
import { ref } from 'vue';

import { createCanvasCell } from '../../canvas';
import { createReplaySession } from '../create-replay-session';
import { createStartState } from '../create-start-state';
import type { ReplaySession } from '../types/replay-session';
import { patchReplayStep } from './patch-replay-step';
import type { ReplayStep } from './types/replay-step';

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

const createSession = (): ReplaySession =>
  createReplaySession(
    { kind: 'ARCHIVE', recording: RECORDING },
    {
      cell: createCanvasCell(ref(null)),
      palette: {} as unknown as Palette,
      levels: [LEVEL],
      score: 0,
      rivals: [],
      frames: NEVER,
    },
  );

const createPlaybackAt = (step: number): ReplayPlayback => ({
  ...createPlayback(createStartState([LEVEL], 0)),
  step,
});

const createStep = (step: number): ReplayStep => ({
  frame: {
    previous: createStartState([LEVEL], 0),
    playback: createPlaybackAt(step),
  },
  ghosts: [],
  alpha: 0.5,
});

describe('patchReplayStep', () => {
  it('should show the frame and the ghosts of the step', () => {
    const session = createSession();
    const step = createStep(5);

    patchReplayStep(session, step);

    expect(session.frame.value).toBe(step.frame);
    expect(session.ghosts.value).toBe(step.ghosts);
  });

  it('should show how far the replay has played when it takes the step', () => {
    const session = createSession();
    session.recording.value = RECORDING;

    patchReplayStep(session, createStep(5));

    expect(session.progress.value).toBe(0.5);
    expect(session.elapsedSeconds.value).toBe(5 * FIXED_STEP_SECONDS);
    expect(session.isFinished.value).toBe(false);
  });

  it('should mark the replay finished when the step reaches its end', () => {
    const session = createSession();
    session.recording.value = RECORDING;

    patchReplayStep(session, createStep(10));

    expect(session.isFinished.value).toBe(true);
    expect(session.progress.value).toBe(1);
  });

  it('should show no time played when the step is the first one', () => {
    const session = createSession();
    session.recording.value = RECORDING;

    patchReplayStep(session, createStep(0));

    expect(session.progress.value).toBe(0);
    expect(session.elapsedSeconds.value).toBe(0);
  });

  it('should hand back the same step when it shows it', () => {
    const step = createStep(5);

    expect(patchReplayStep(createSession(), step)).toBe(step);
  });
});
