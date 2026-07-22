import { times } from 'lodash-es';

import { TILE_SIZE } from '../types';
import { SPIKE_HEIGHT_FRACTION, SPIKE_PRONGS } from './constants';
import type { Triangle } from './triangle';

export function spikeTriangles(tileX: number, tileY: number): Triangle[] {
  const left = tileX * TILE_SIZE;
  const base = tileY * TILE_SIZE + TILE_SIZE;
  const prongWidth = TILE_SIZE / SPIKE_PRONGS;
  const prongHeight = TILE_SIZE * SPIKE_HEIGHT_FRACTION;

  return times(SPIKE_PRONGS, (prongIndex): Triangle => {
    const prongLeft = left + prongIndex * prongWidth;
    return [
      { x: prongLeft, y: base },
      { x: prongLeft + prongWidth / 2, y: base - prongHeight },
      { x: prongLeft + prongWidth, y: base },
    ];
  });
}
