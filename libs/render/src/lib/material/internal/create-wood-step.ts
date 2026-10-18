import { TILE_SIZE } from '@mander/model';
import { chain } from '@mander/utils';
import { map, range } from 'lodash-es';
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
  chain({ column: pixelX / TILE_SIZE, row: pixelY / TILE_SIZE })
    .thru(({ column, row }) =>
      map(range(PLANKS_PER_TILE), (course) =>
        createPlankStep(
          pixelX,
          pixelY + course * PLANK_HEIGHT,
          hashTileNoise(column, row * PLANKS_PER_TILE + course),
          style,
        ),
      ),
    )
    .thru(createSequenceStep)
    .value();
