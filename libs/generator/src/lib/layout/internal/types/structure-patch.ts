import type { Tile } from '@mander/model';
import type { TilePatch } from '../../../types/tile-patch';

export interface StructurePatch {
  tiles: Tile[][];
  frontPatches: TilePatch[];
  backPatches: TilePatch[];
}
