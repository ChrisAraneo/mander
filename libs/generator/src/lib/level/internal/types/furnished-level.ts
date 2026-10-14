import type { Tile } from '@mander/model';
import type { Sector } from '@mander/structures';
import type { createRandom } from '@mander/utils';

export interface FurnishedLevel {
  levelNumber: number;
  structures: Sector[];
  tiles: Tile[][];
  backTiles: Tile[][];
  random: ReturnType<typeof createRandom>;
}
