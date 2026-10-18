import type { createRandom } from '@mander/engine';
import type { Tile } from '@mander/model';
import type { Sector } from '@mander/structures';
import type { LevelType } from '../../../types/level-type';

export interface LevelDraft {
  levelNumber: number;
  levelType: LevelType;
  structures: Sector[];
  tiles: Tile[][];
  backTiles: Tile[][];
  random: ReturnType<typeof createRandom>;
}
