import type { Random } from '@mander/common';
import type { Season, Tile } from '@mander/model';
import type { Sector } from '@mander/structures';
import type { LevelVariant } from '../../../types/level-variant';

export interface LevelFurniture {
  levelNumber: number;
  levelVariant: LevelVariant;
  season: Season;
  structures: Sector[];
  tiles: Tile[][];
  backTiles: Tile[][];
  random: Random;
}
