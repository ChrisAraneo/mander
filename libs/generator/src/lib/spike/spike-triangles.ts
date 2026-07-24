import { times } from 'lodash-es';
import { match } from 'ts-pattern';

import { TILE_SIZE } from '../types';
import { SPIKE_HEIGHT_FRACTION, SPIKE_PRONGS } from './constants';
import type { SpikeOrientation } from './spike-orientation';
import type { Triangle } from './triangle';

const PRONG_HEIGHT = TILE_SIZE * SPIKE_HEIGHT_FRACTION;
const PRONG_WIDTH = TILE_SIZE / SPIKE_PRONGS;

interface ProngGeometry {
  left: number;
  base: number;
  apex: number;
}

const prongGeometry = (
  tileX: number,
  tileY: number,
  orientation: SpikeOrientation,
): ProngGeometry =>
  match(orientation)
    .with(
      'CEILING',
      (): ProngGeometry => ({
        left: tileX * TILE_SIZE,
        base: tileY * TILE_SIZE,
        apex: tileY * TILE_SIZE + PRONG_HEIGHT,
      }),
    )
    .otherwise(
      (): ProngGeometry => ({
        left: tileX * TILE_SIZE,
        base: tileY * TILE_SIZE + TILE_SIZE,
        apex: tileY * TILE_SIZE + TILE_SIZE - PRONG_HEIGHT,
      }),
    );

const prongCorners = (geometry: ProngGeometry, prongLeft: number): Triangle => [
  { x: prongLeft, y: geometry.base },
  { x: prongLeft + PRONG_WIDTH / 2, y: geometry.apex },
  { x: prongLeft + PRONG_WIDTH, y: geometry.base },
];

const prongTriangle =
  (geometry: ProngGeometry) =>
  (prongIndex: number): Triangle =>
    prongCorners(geometry, geometry.left + prongIndex * PRONG_WIDTH);

export const spikeTriangles = (
  tileX: number,
  tileY: number,
  orientation: SpikeOrientation,
): Triangle[] =>
  times(SPIKE_PRONGS, prongTriangle(prongGeometry(tileX, tileY, orientation)));
