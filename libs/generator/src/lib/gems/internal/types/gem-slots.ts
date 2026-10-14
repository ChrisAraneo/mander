import type { Tile } from '@mander/model';
import type { createRandom } from '@mander/utils';
import type { LevelType } from '../../../types/level-type';
import type { Spot } from '../../../types/spot';

export interface GemSlots {
  tiles: Tile[][];
  levelType: LevelType;
  slots: Spot[][];
  random: ReturnType<typeof createRandom>;
}
