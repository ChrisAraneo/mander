import type { createRandom } from '@mander/engine';
import type { Tile } from '@mander/model';
import type { Sector } from '@mander/structures';
import type { LevelVariant } from '../../../types/level-variant';

export interface FurnishedLevel {
  levelNumber: number;
  levelVariant: LevelVariant;
  structures: Sector[];
  tiles: Tile[][];
  backTiles: Tile[][];
  random: ReturnType<typeof createRandom>;
}
