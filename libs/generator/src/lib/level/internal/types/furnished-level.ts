import type { createRandom } from '@mander/engine';
import type { Tile } from '@mander/model';
import type { Sector } from '@mander/structures';

export interface FurnishedLevel {
  levelNumber: number;
  structures: Sector[];
  tiles: Tile[][];
  backTiles: Tile[][];
  random: ReturnType<typeof createRandom>;
}
