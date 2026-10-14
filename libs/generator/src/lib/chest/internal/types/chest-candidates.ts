import type { Tile } from '@mander/model';
import type { LevelType } from '../../../types/level-type';
import type { Spot } from '../../../types/spot';

export interface ChestCandidates {
  tiles: Tile[][];
  levelType: LevelType;
  candidates: Spot[];
}
