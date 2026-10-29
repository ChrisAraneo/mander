import {
  addRecordedAction,
  createRecorder,
  type GameLevel,
  type GameState,
  type Replay,
} from '@mander/engine';
import { FIXED_STEP_MS, type Tile, TILE_AIR } from '@mander/model';
import type { Palette } from '@mander/render';
import { constant, times } from 'lodash-es';
import { NEVER, type Observable, of, Subject } from 'rxjs';
import { describe, expect, it } from 'vitest';
import { ref, shallowRef } from 'vue';

import { createCanvasCell } from '../canvas';
import type { AnimationFrame } from '../tick';
import { createReplaySession } from './create-replay-session';
import { startReplay } from './start-replay';
import type { ReplaySession } from './types/replay-session';

const LEVEL: GameLevel = {
  seed: 'RUN',
  width: 4,
  height: 4,
  tiles: times(4, (): Tile[] => times(4, constant(TILE_AIR))),
  chestItems: [],
  hornedEnemyChance: 0,
  fastEnemyChance: 0,
  shooterEnemyChance: 0,
};

const RECORDING: Replay = { worldName: 'ABC', steps: 10, entries: [] };

const createSession = (
  frames: Observable<AnimationFrame> = NEVER,
): ReplaySession =>
  createReplaySession(
    { kind: 'ARCHIVE', recording: RECORDING },
    {
      cell: createCanvasCell(ref(null)),
      palette: {} as unknown as Palette,
      levels: [LEVEL],
      score: 0,
      rivals: [],
      frames,
    },
  );

describe('startReplay', () => {
  it('should show the replay from its first step when it starts playing', () => {
    const session = startReplay(createSession());

    expect(session.isActive.value).toBe(true);
    expect(session.frame.value?.playback.step).toBe(0);
    expect(session.progress.value).toBe(0);
    expect(session.elapsedSeconds.value).toBe(0);
  });

  it('should take the length of the recording when it starts playing', () => {
    const session = startReplay(createSession());

    expect(session.recording.value).toBe(RECORDING);
    expect(session.durationSeconds.value).toBe((10 * FIXED_STEP_MS) / 1000);
  });

  it('should play at the normal speed and unpaused when it starts again', () => {
    const session = createSession();
    session.speed.value = 4;
    session.isPaused.value = true;

    startReplay(session);

    expect(session.speed.value).toBe(1);
    expect(session.isPaused.value).toBe(false);
  });

  it('should take the recording made so far when the replay comes from the game', () => {
    const recorder = addRecordedAction(createRecorder('ABC'), {
      type: 'TICK',
    });
    const session = createReplaySession(
      {
        kind: 'GAME',
        recorder: shallowRef(recorder),
        state: shallowRef({} as unknown as GameState),
      },
      createSession().stage,
    );

    startReplay(session);

    expect(session.recording.value.steps).toBe(1);
  });

  it('should move the replay on when the frames come in', () => {
    const session = startReplay(
      createSession(of({ timestamp: 0 }, { timestamp: FIXED_STEP_MS * 2 })),
    );

    expect(session.frame.value?.playback.step).toBe(2);
    expect(session.progress.value).toBeCloseTo(0.2);
  });

  it('should hold the replay still when it is paused', () => {
    const frames = new Subject<AnimationFrame>();
    const session = startReplay(createSession(frames));
    session.isPaused.value = true;

    frames.next({ timestamp: 0 });
    frames.next({ timestamp: FIXED_STEP_MS * 2 });

    expect(session.frame.value?.playback.step).toBe(0);
  });

  it('should let go of the earlier playing when it starts again', () => {
    const session = startReplay(createSession());
    const earlier = session.subscription.value;

    startReplay(session);

    expect(earlier?.closed).toBe(true);
    expect(session.subscription.value?.closed).toBe(false);
  });
});
