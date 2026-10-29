import type { GameLevel, Replay } from '@mander/engine';
import { type Tile, TILE_AIR } from '@mander/model';
import type { Palette } from '@mander/render';
import { constant, times } from 'lodash-es';
import { NEVER } from 'rxjs';
import { describe, expect, it } from 'vitest';
import { ref } from 'vue';

import { createCanvasCell } from '../../canvas';
import { createReplaySession } from '../create-replay-session';
import type { ReplaySession } from '../types/replay-session';
import { patchReplayPause } from './patch-replay-pause';

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

describe('patchReplayPause', () => {
  it('should pause the replay when it is playing', () => {
    expect(patchReplayPause(createSession()).isPaused.value).toBe(true);
  });

  it('should resume the replay when it is paused', () => {
    const session = createSession();
    session.isPaused.value = true;

    patchReplayPause(session);

    expect(session.isPaused.value).toBe(false);
  });

  it('should hand back the same session when it flips the pause', () => {
    const session = createSession();

    expect(patchReplayPause(session)).toBe(session);
  });
});
