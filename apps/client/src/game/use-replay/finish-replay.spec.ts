import type { GameLevel, Replay } from '@mander/engine';
import { type Tile, TILE_AIR } from '@mander/model';
import type { Palette } from '@mander/render';
import { constant, times } from 'lodash-es';
import { NEVER } from 'rxjs';
import { describe, expect, it } from 'vitest';
import { ref } from 'vue';

import { createCanvasCell } from '../canvas';
import { createReplaySession } from './create-replay-session';
import { finishReplay } from './finish-replay';
import { startReplay } from './start-replay';
import type { ReplaySession } from './types/replay-session';

const LEVEL: GameLevel = {
  seed: 'RUN',
  width: 4,
  height: 4,
  tiles: times(4, (): Tile[] => times(4, constant(TILE_AIR))),
  chestItems: [],
  hornedEnemyChance: 0,
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

describe('finishReplay', () => {
  it('should put the replay away when it stops it', () => {
    const session = finishReplay(startReplay(createSession()));

    expect(session.isActive.value).toBe(false);
    expect(session.frame.value).toBeNull();
    expect(session.ghosts.value).toEqual([]);
    expect(session.subscription.value).toBeNull();
  });

  it('should let go of the playing when it stops the replay', () => {
    const session = startReplay(createSession());
    const playing = session.subscription.value;

    finishReplay(session);

    expect(playing?.closed).toBe(true);
  });

  it('should keep the recording when it stops the replay', () => {
    expect(finishReplay(startReplay(createSession())).recording.value).toBe(
      RECORDING,
    );
  });

  it('should do nothing harmful when the replay was never played', () => {
    expect(finishReplay(createSession()).isActive.value).toBe(false);
  });
});
