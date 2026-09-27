import { type FallingSpike, type Level, TILE_SIZE } from '@mander/model';

import { FALLING_SPIKE_PIT_TILES } from './consts';

export const hasLeftLevel = (level: Level, spike: FallingSpike): boolean =>
  spike.position.y > (level.height + FALLING_SPIKE_PIT_TILES) * TILE_SIZE;
