import type { Tile } from '@mander/model';
import type { LevelType } from '../../../types/level-type';
import type { Spot } from '../../../types/spot';

export interface ShuffledGemSlots {
  tiles: Tile[][];
  levelType: LevelType;
  slots: Spot[][];
}
