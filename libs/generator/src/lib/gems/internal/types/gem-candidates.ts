import type { Random } from '@mander/common';
import type { Tile } from '@mander/model';
import type { LevelType } from '../../../types/level-type';
import type { Spot } from '../../../types/spot';

export interface GemCandidates {
  tiles: Tile[][];
  levelType: LevelType;
  candidates: Spot[];
  random: Random;
}
