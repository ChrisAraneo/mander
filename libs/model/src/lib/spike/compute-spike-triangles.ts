import { times } from 'lodash-es';
import { pipe } from 'remeda';
import { match } from 'ts-pattern';
import { TILE_SIZE } from '../tile/consts';
import { PRONG_HEIGHT, PRONG_PITCH, PRONG_WIDTH, SPIKE_PRONGS } from './consts';
import type { ProngEdges } from './types/prong-edges';
import type { SpikeOrientation } from './types/spike-orientation';
import type { SpikeShape } from './types/spike-shape';
import type { Triangle } from './types/triangle';

const toProngCount = (shape: SpikeShape): number =>
  match(shape)
    .with('SINGLE', () => 1)
    .with('STRIP', () => SPIKE_PRONGS)
    .exhaustive();

const computeFirstProngLeft = (pixelX: number, prongs: number): number =>
  pixelX + (TILE_SIZE - ((prongs - 1) * PRONG_PITCH + PRONG_WIDTH)) / 2;

const computeProngEdges = (
  pixelY: number,
  orientation: SpikeOrientation,
): ProngEdges =>
  match(orientation)
    .with('CEILING', (): ProngEdges => ({
      base: pixelY,
      apex: pixelY + PRONG_HEIGHT,
    }))
    .with('FLOOR', (): ProngEdges => ({
      base: pixelY + TILE_SIZE,
      apex: pixelY + TILE_SIZE - PRONG_HEIGHT,
    }))
    .exhaustive();

const createProngTriangle = (
  prongLeft: number,
  { base, apex }: ProngEdges,
): Triangle => [
  { x: prongLeft, y: base },
  { x: prongLeft + PRONG_WIDTH / 2, y: apex },
  { x: prongLeft + PRONG_WIDTH, y: base },
];

export const computeSpikeTriangles = (
  pixelX: number,
  pixelY: number,
  orientation: SpikeOrientation,
  shape: SpikeShape,
): Triangle[] =>
  pipe(
    shape,
    toProngCount,
    (prongs) => ({
      prongs,
      left: computeFirstProngLeft(pixelX, prongs),
      edges: computeProngEdges(pixelY, orientation),
    }),
    ({ prongs, left, edges }) =>
      times(prongs, (prongIndex) =>
        createProngTriangle(left + prongIndex * PRONG_PITCH, edges),
      ),
  );
