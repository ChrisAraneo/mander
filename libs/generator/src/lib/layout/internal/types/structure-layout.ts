import type { LevelType } from '../../../types/level-type';
import type { StructurePlacement } from './structure-placement';

export interface StructureLayout {
  levelType: LevelType;
  placements: StructurePlacement[];
}
