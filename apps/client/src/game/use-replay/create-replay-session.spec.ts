import type { GameLevel, Replay } from '@mander/engine';
import { type Tile, TILE_AIR } from '@mander/model';
import type { Palette } from '@mander/render';
import { constant, times } from 'lodash-es';
import { NEVER } from 'rxjs';
import { describe, expect, it } from 'vitest';
import { ref } from 'vue';

import { createCanvasCell } from '../canvas';
import { createReplaySession } from './create-replay-session';
import type { ReplayStage } from './types/replay-stage';

const LEVEL: GameLevel = {
  seed: 'RUN',
  width: 4,
  height: 4,
  tiles: times(4, (): Tile[] => times(4, constant(TILE_AIR))),
  chestItems: [],
  hornedEnemyChance: 0,
};

const RECORDING: Replay = { worldName: 'ABC', steps: 10, entries: [] };

const createStage = (): ReplayStage => ({
  cell: createCanvasCell(ref(null)),
  palette: {} as unknown as Palette,
  levels: [LEVEL],
  score: 0,
  rivals: [],
  frames: NEVER,
});

describe('createReplaySession', () => {
  it('should keep where the replay comes from and where it is drawn', () => {
    const origin = { kind: 'ARCHIVE' as const, recording: RECORDING };
    const stage = createStage();

    const session = createReplaySession(origin, stage);

    expect(session.origin).toBe(origin);
    expect(session.stage).toBe(stage);
  });

  it('should wait unplayed at the normal speed when the session is new', () => {
    const session = createReplaySession(
      { kind: 'ARCHIVE', recording: RECORDING },
      createStage(),
    );

    expect(session.isActive.value).toBe(false);
    expect(session.isPaused.value).toBe(false);
    expect(session.isFinished.value).toBe(false);
    expect(session.speed.value).toBe(1);
    expect(session.progress.value).toBe(0);
    expect(session.frame.value).toBeNull();
    expect(session.ghosts.value).toEqual([]);
    expect(session.subscription.value).toBeNull();
  });
});
