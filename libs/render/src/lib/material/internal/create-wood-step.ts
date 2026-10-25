import { TILE_SIZE } from '@mander/model';
import { map, range } from 'lodash-es';
import { pipe } from 'remeda';
import { createSequenceStep } from '../../canvas/create-sequence-step';
import type { CanvasStep } from '../../types/canvas-step';
import type { MaterialStyle } from '../../types/material-style';
import { PLANK_HEIGHT } from './consts';
import { createPlankStep } from './create-plank-step';
import { hashTileNoise } from './hash-tile-noise';

const PLANKS_PER_TILE = 2;

export const createWoodStep = (
  pixelX: number,
  pixelY: number,
  style: MaterialStyle,
): CanvasStep =>
  pipe(
    { column: pixelX / TILE_SIZE, row: pixelY / TILE_SIZE },
    ({ column, row }) =>
      map(range(PLANKS_PER_TILE), (course) =>
        createPlankStep(
          pixelX,
          pixelY + course * PLANK_HEIGHT,
          hashTileNoise(column, row * PLANKS_PER_TILE + course),
          style,
        ),
      ),
    createSequenceStep,
  );
