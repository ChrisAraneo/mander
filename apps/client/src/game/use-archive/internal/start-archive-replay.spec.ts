import type { GameLevel, Replay } from '@mander/engine';
import { type Tile, TILE_AIR } from '@mander/model';
import type { Palette } from '@mander/render';
import { constant, times } from 'lodash-es';
import { NEVER } from 'rxjs';
import { describe, expect, it } from 'vitest';
import { ref } from 'vue';

import { createCanvasCell } from '../../canvas';
import { createReplaySession, type ReplaySession } from '../../use-replay';
import { startArchiveReplay } from './start-archive-replay';

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

describe('startArchiveReplay', () => {
  it('should leave the replay stopped when the canvas is not mounted', () => {
    const session = createSession();

    startArchiveReplay(session);

    expect(session.isActive.value).toBe(false);
    expect(session.subscription.value).toBeNull();
    expect(session.stage.cell.context.value).toBeNull();
  });

  it('should hand back the same session when the canvas is not mounted', () => {
    const session = createSession();

    expect(startArchiveReplay(session)).toBe(session);
  });
});
