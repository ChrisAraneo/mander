import type { createRandom } from '@mander/engine';
import type { Tile } from '@mander/model';
import type { Sector } from '@mander/structures';
import type { LevelVariant } from '../../../types/level-variant';
import type { LevelType } from '../../../types/level-type';

export interface LevelDraft {
  levelNumber: number;
  levelVariant: LevelVariant;
  levelType: LevelType;
  structures: Sector[];
  tiles: Tile[][];
  backTiles: Tile[][];
  random: ReturnType<typeof createRandom>;
}
