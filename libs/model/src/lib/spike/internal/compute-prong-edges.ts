import { match } from 'ts-pattern';
import { TILE_SIZE } from '../../tile/consts';
import { PRONG_HEIGHT } from '../consts';
import type { SpikeOrientation } from '../types/spike-orientation';
import type { ProngEdges } from './types/prong-edges';

export const computeProngEdges = (
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
