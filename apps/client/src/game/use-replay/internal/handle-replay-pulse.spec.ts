import type { GameLevel, Replay } from '@mander/engine';
import { type Tile, TILE_AIR } from '@mander/model';
import type { Palette } from '@mander/render';
import { constant, times } from 'lodash-es';
import { NEVER } from 'rxjs';
import { describe, expect, it } from 'vitest';
import { ref } from 'vue';

import { createCanvasCell } from '../../canvas';
import { createReplaySession } from '../create-replay-session';
import { startReplay } from '../start-replay';
import type { ReplaySession } from '../types/replay-session';
import { handleReplayPulse } from './handle-replay-pulse';

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

describe('handleReplayPulse', () => {
  it('should move the replay on by the steps of the pulse when it is playing', () => {
    const session = startReplay(createSession());

    handleReplayPulse(session, { steps: 2, alpha: 0 });

    expect(session.frame.value?.playback.step).toBe(2);
  });

  it('should move the replay on faster when the speed is raised', () => {
    const session = startReplay(createSession());
    session.speed.value = 2;

    handleReplayPulse(session, { steps: 2, alpha: 0 });

    expect(session.frame.value?.playback.step).toBe(4);
  });

  it('should keep the frame when the replay is paused', () => {
    const session = startReplay(createSession());
    session.isPaused.value = true;
    const frame = session.frame.value;

    handleReplayPulse(session, { steps: 2, alpha: 0 });

    expect(session.frame.value).toBe(frame);
  });

  it('should keep the frame when the replay has finished', () => {
    const session = startReplay(createSession());
    session.isFinished.value = true;
    const frame = session.frame.value;

    handleReplayPulse(session, { steps: 2, alpha: 0 });

    expect(session.frame.value).toBe(frame);
  });

  it('should show no frame when the replay was never started', () => {
    const session = createSession();

    handleReplayPulse(session, { steps: 2, alpha: 0 });

    expect(session.frame.value).toBeNull();
  });
});
