import type { Sector } from '@mander/structures';
import type { LevelCategory } from '../world/types/level-category';

export interface StructureChoice {
  name: string;
  category: LevelCategory;
  structure: Sector;
}
