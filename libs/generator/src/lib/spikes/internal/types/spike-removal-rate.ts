import type { createRandom } from '@mander/engine';
import type { Tile } from '@mander/model';

export interface SpikeRemovalRate {
  tiles: Tile[][];
  rate: number;
  random: ReturnType<typeof createRandom>;
}
