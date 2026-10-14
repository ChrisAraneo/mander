import type { Tile } from '@mander/model';
import type { LevelType } from '../../../types/level-type';
import type { LayerPlacement } from './layer-placement';

export interface StructureLayerSplit {
  levelType: LevelType;
  tiles: Tile[][];
  fronts: LayerPlacement[];
  backs: LayerPlacement[];
}
