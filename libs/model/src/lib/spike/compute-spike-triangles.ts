import { times } from 'lodash-es';
import { match } from 'ts-pattern';

import type { Triangle } from '@mander/utils';
import { TILE_SIZE } from '../blocks/consts';
import {
  FLOOR_PRONG_HEIGHT,
  PRONG_HEIGHT,
  PRONG_WIDTH,
  SPIKE_PRONGS,
} from './spike';
import type { SpikeOrientation } from './spike-orientation';
import type { SpikeShape } from './spike-shape';

const prongCount = (shape: SpikeShape): number =>
  match(shape)
    .with('SINGLE', () => 1)
    .otherwise(() => SPIKE_PRONGS);

export const computeSpikeTriangles = (
  tileX: number,
  tileY: number,
  orientation: SpikeOrientation,
  shape: SpikeShape,
): Triangle[] => {
  const prongs = prongCount(shape);
  // Whatever width the prongs leave over is split evenly, so a lone prong
  // lands in the middle of its tile.
  const geometry = match(orientation)
    .with('CEILING', () => ({
      left: tileX * TILE_SIZE + (TILE_SIZE - prongs * PRONG_WIDTH) / 2,
      base: tileY * TILE_SIZE,
      apex: tileY * TILE_SIZE + PRONG_HEIGHT,
    }))
    .otherwise(() => ({
      left: tileX * TILE_SIZE + (TILE_SIZE - prongs * PRONG_WIDTH) / 2,
      base: tileY * TILE_SIZE + TILE_SIZE,
      apex: tileY * TILE_SIZE + TILE_SIZE - FLOOR_PRONG_HEIGHT,
    }));

  return times(prongs, (prongIndex): Triangle => {
    const prongLeft = geometry.left + prongIndex * PRONG_WIDTH;
    return [
      { x: prongLeft, y: geometry.base },
      { x: prongLeft + PRONG_WIDTH / 2, y: geometry.apex },
      { x: prongLeft + PRONG_WIDTH, y: geometry.base },
    ];
  });
};
