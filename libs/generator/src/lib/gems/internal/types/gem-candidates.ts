import type { Tile } from '@mander/model';
import type { createRandom } from '@mander/utils';
import type { LevelType } from '../../../types/level-type';
import type { Spot } from '../../../types/spot';

export interface GemCandidates {
  tiles: Tile[][];
  levelType: LevelType;
  candidates: Spot[];
  random: ReturnType<typeof createRandom>;
}
