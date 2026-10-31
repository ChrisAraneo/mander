import type { Random } from '@mander/engine';
import type { Season, Tile } from '@mander/model';
import type { Sector } from '@mander/structures';
import type { LevelType } from '../../../types/level-type';
import type { LevelVariant } from '../../../types/level-variant';

export interface LevelDraft {
  levelNumber: number;
  levelVariant: LevelVariant;
  levelType: LevelType;
  season: Season;
  structures: Sector[];
  tiles: Tile[][];
  backTiles: Tile[][];
  random: Random;
}
