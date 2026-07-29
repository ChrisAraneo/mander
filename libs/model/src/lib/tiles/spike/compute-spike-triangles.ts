import { times } from 'lodash-es';
import { match } from 'ts-pattern';

import type { Triangle } from '@mander/utils';
import { TILE_SIZE } from '../consts';
import { PRONG_HEIGHT, PRONG_WIDTH, SPIKE_PRONGS } from './spike';
import type { SpikeOrientation } from './spike-orientation';

export const computeSpikeTriangles = (
  tileX: number,
  tileY: number,
  orientation: SpikeOrientation,
): Triangle[] => {
  const geometry = match(orientation)
    .with('CEILING', () => ({
      left: tileX * TILE_SIZE,
      base: tileY * TILE_SIZE,
      apex: tileY * TILE_SIZE + PRONG_HEIGHT,
    }))
    .otherwise(() => ({
      left: tileX * TILE_SIZE,
      base: tileY * TILE_SIZE + TILE_SIZE,
      apex: tileY * TILE_SIZE + TILE_SIZE - PRONG_HEIGHT,
    }));

  return times(SPIKE_PRONGS, (prongIndex): Triangle => {
    const prongLeft = geometry.left + prongIndex * PRONG_WIDTH;
    return [
      { x: prongLeft, y: geometry.base },
      { x: prongLeft + PRONG_WIDTH / 2, y: geometry.apex },
      { x: prongLeft + PRONG_WIDTH, y: geometry.base },
    ];
  });
};
