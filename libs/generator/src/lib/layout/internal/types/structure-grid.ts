import type { Tile } from '@mander/model';
import type { LevelType } from '../../../types/level-type';
import type { StructurePlacement } from './structure-placement';

export interface StructureGrid {
  levelType: LevelType;
  placements: StructurePlacement[];
  tiles: Tile[][];
}
