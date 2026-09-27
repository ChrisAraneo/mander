import { times } from 'lodash-es';
import { match } from 'ts-pattern';

import type { Triangle } from '@mander/utils';
import { TILE_SIZE } from '../tile/consts';
import { PRONG_HEIGHT, PRONG_PITCH, PRONG_WIDTH, SPIKE_PRONGS } from './spike';
import type { SpikeOrientation } from './spike-orientation';
import type { SpikeShape } from './spike-shape';

export const computeSpikeTriangles = (
  pixelX: number,
  pixelY: number,
  orientation: SpikeOrientation,
  shape: SpikeShape,
): Triangle[] => {
  const prongs = match(shape)
    .with('SINGLE', () => 1)
    .otherwise(() => SPIKE_PRONGS);
  const span = (prongs - 1) * PRONG_PITCH + PRONG_WIDTH;
  const left = pixelX + (TILE_SIZE - span) / 2;
  const { base, apex } = match(orientation)
    .with('CEILING', () => ({
      base: pixelY,
      apex: pixelY + PRONG_HEIGHT,
    }))
    .otherwise(() => ({
      base: pixelY + TILE_SIZE,
      apex: pixelY + TILE_SIZE - PRONG_HEIGHT,
    }));

  return times(prongs, (prongIndex): Triangle => {
    const prongLeft = left + prongIndex * PRONG_PITCH;
    return [
      { x: prongLeft, y: base },
      { x: prongLeft + PRONG_WIDTH / 2, y: apex },
      { x: prongLeft + PRONG_WIDTH, y: base },
    ];
  });
};
