import { createInitialState, type GameLevel } from '@mander/engine';
import { type Tile, TILE_AIR } from '@mander/model';
import type { Palette } from '@mander/render';
import { constant, times } from 'lodash-es';
import { describe, expect, it } from 'vitest';
import { ref, shallowRef } from 'vue';

import { createCanvasCell } from '../../canvas';
import type { Backdrop } from '../types/backdrop';
import { createBackdropStartFrame } from './create-backdrop-start-frame';
import { drawBackdropPulse } from './draw-backdrop-pulse';

const LEVEL: GameLevel = {
  seed: 'RUN',
  width: 4,
  height: 4,
  tiles: times(4, (): Tile[] => times(4, constant(TILE_AIR))),
  chestItems: [],
  hornedEnemyChance: 0,
  shooterEnemyChance: 0,
};

const createBackdropFixture = (canvas: HTMLCanvasElement | null): Backdrop => ({
  cell: createCanvasCell(ref(canvas)),
  palette: {} as unknown as Palette,
  focus: { x: 0, y: 0 },
  idle: createInitialState(LEVEL, 0, []),
  frame: shallowRef(createBackdropStartFrame(createInitialState(LEVEL, 0, []))),
  subscription: shallowRef(null),
});

describe('drawBackdropPulse', () => {
  it('should draw nothing when the canvas is not mounted', () => {
    expect(
      drawBackdropPulse(createBackdropFixture(null), { steps: 1, alpha: 0.5 }),
    ).toBeUndefined();
  });

  it('should leave the canvas alone when it has no drawing context yet', () => {
    const canvas = {} as unknown as HTMLCanvasElement;

    drawBackdropPulse(createBackdropFixture(canvas), { steps: 1, alpha: 0.5 });

    expect(canvas).toEqual({});
  });
});
