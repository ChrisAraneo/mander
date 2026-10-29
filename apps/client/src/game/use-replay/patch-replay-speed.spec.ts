import type { GameLevel, Replay } from '@mander/engine';
import { type Tile, TILE_AIR } from '@mander/model';
import type { Palette } from '@mander/render';
import { constant, times } from 'lodash-es';
import { NEVER } from 'rxjs';
import { describe, expect, it } from 'vitest';
import { ref } from 'vue';

import { createCanvasCell } from '../canvas';
import { createReplaySession } from './create-replay-session';
import { patchReplaySpeed } from './patch-replay-speed';
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

describe('patchReplaySpeed', () => {
  it('should play the replay one speed faster when it is at the normal speed', () => {
    expect(patchReplaySpeed(createSession()).speed.value).toBe(2);
  });

  it('should go back to the normal speed when it is at the fastest', () => {
    const session = createSession();
    session.speed.value = 4;

    expect(patchReplaySpeed(session).speed.value).toBe(1);
  });
});
