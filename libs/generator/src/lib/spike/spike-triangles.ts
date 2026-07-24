import { times } from 'lodash-es';

import { TILE_SIZE } from '../types';
import { SPIKE_HEIGHT_FRACTION, SPIKE_PRONGS } from './constants';
import type { Triangle } from './triangle';

interface ProngGeometry {
  left: number;
  base: number;
  prongWidth: number;
  prongHeight: number;
}

const prongGeometry = (tileX: number, tileY: number): ProngGeometry => ({
  left: tileX * TILE_SIZE,
  base: tileY * TILE_SIZE + TILE_SIZE,
  prongWidth: TILE_SIZE / SPIKE_PRONGS,
  prongHeight: TILE_SIZE * SPIKE_HEIGHT_FRACTION,
});

const prongCorners = (geometry: ProngGeometry, prongLeft: number): Triangle => [
  { x: prongLeft, y: geometry.base },
  {
    x: prongLeft + geometry.prongWidth / 2,
    y: geometry.base - geometry.prongHeight,
  },
  { x: prongLeft + geometry.prongWidth, y: geometry.base },
];

const prongTriangle =
  (geometry: ProngGeometry) =>
  (prongIndex: number): Triangle =>
    prongCorners(geometry, geometry.left + prongIndex * geometry.prongWidth);

export const spikeTriangles = (tileX: number, tileY: number): Triangle[] =>
  times(SPIKE_PRONGS, prongTriangle(prongGeometry(tileX, tileY)));
