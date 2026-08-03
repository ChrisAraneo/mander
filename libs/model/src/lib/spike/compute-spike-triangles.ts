import { times } from 'lodash-es';
import { match } from 'ts-pattern';

import type { Triangle } from '@mander/utils';
import { TILE_SIZE } from '../tile/consts';
import { PRONG_HEIGHT, PRONG_PITCH, PRONG_WIDTH, SPIKE_PRONGS } from './spike';
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
  const span = (prongs - 1) * PRONG_PITCH + PRONG_WIDTH;
  const geometry = match(orientation)
    .with('CEILING', () => ({
      left: tileX * TILE_SIZE + (TILE_SIZE - span) / 2,
      base: tileY * TILE_SIZE,
      apex: tileY * TILE_SIZE + PRONG_HEIGHT,
    }))
    .otherwise(() => ({
      left: tileX * TILE_SIZE + (TILE_SIZE - span) / 2,
      base: tileY * TILE_SIZE + TILE_SIZE,
      apex: tileY * TILE_SIZE + TILE_SIZE - PRONG_HEIGHT,
    }));

  return times(prongs, (prongIndex): Triangle => {
    const prongLeft = geometry.left + prongIndex * PRONG_PITCH;
    return [
      { x: prongLeft, y: geometry.base },
      { x: prongLeft + PRONG_WIDTH / 2, y: geometry.apex },
      { x: prongLeft + PRONG_WIDTH, y: geometry.base },
    ];
  });
};
