import type { Tile } from '@mander/model';
import type { createRandom } from '@mander/utils';

export interface BeartrapRemovalRate {
  tiles: Tile[][];
  rate: number;
  random: ReturnType<typeof createRandom>;
}
