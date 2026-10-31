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
import { createFirstReplayStep } from './create-first-replay-step';
import { drawReplayStep } from './draw-replay-step';

const LEVEL: GameLevel = {
  seed: 'RUN',
  width: 4,
  height: 4,
  tiles: times(4, (): Tile[] => times(4, constant(TILE_AIR))),
  chestItems: [],
  hornedEnemyChance: 0,
  fastEnemyChance: 0,
  shooterEnemyChance: 0,
  freezingEnemyChance: 0,
};

const RECORDING: Replay = { worldName: 'ABC', steps: 10, entries: [] };

const createSession = (canvas: HTMLCanvasElement | null): ReplaySession =>
  createReplaySession(
    { kind: 'ARCHIVE', recording: RECORDING },
    {
      cell: createCanvasCell(ref(canvas)),
      palette: {} as unknown as Palette,
      levels: [LEVEL],
      score: 0,
      rivals: [],
      frames: NEVER,
    },
  );

describe('drawReplayStep', () => {
  it('should draw nothing when the canvas is not mounted', () => {
    const session = createSession(null);

    expect(
      drawReplayStep(session, createFirstReplayStep(session.stage)),
    ).toBeUndefined();
  });

  it('should leave the canvas alone when it has no drawing context yet', () => {
    const canvas = {} as unknown as HTMLCanvasElement;
    const session = createSession(canvas);

    drawReplayStep(session, createFirstReplayStep(session.stage));

    expect(canvas).toEqual({});
  });
});
