import type { GameLevel } from '@mander/engine';
import { type Tile, TILE_AIR } from '@mander/model';
import type { Palette } from '@mander/render';
import { constant, times } from 'lodash-es';
import { NEVER } from 'rxjs';
import { describe, expect, it } from 'vitest';
import { ref } from 'vue';

import { createCanvasCell } from '../canvas';
import { createStartState } from './create-start-state';
import { drawStageState } from './draw-stage-state';
import type { ReplayStage } from './types/replay-stage';

const LEVEL: GameLevel = {
  seed: 'RUN',
  width: 4,
  height: 4,
  tiles: times(4, (): Tile[] => times(4, constant(TILE_AIR))),
  chestItems: [],
  hornedEnemyChance: 0,
};

const createStage = (canvas: HTMLCanvasElement | null): ReplayStage => ({
  cell: createCanvasCell(ref(canvas)),
  palette: {} as unknown as Palette,
  levels: [LEVEL],
  score: 0,
  rivals: [],
  frames: NEVER,
});

describe('drawStageState', () => {
  it('should draw nothing when the canvas is not mounted', () => {
    expect(
      drawStageState(createStage(null), createStartState([LEVEL], 0), []),
    ).toBeUndefined();
  });

  it('should leave the canvas alone when it has no drawing context yet', () => {
    const canvas = {} as unknown as HTMLCanvasElement;

    drawStageState(createStage(canvas), createStartState([LEVEL], 0), []);

    expect(canvas).toEqual({});
  });
});
