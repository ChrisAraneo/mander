import type { Tile } from '@mander/model';
import type { TilePatch } from '../../../types/tile-patch';

export interface BeartrapPatch {
  tiles: Tile[][];
  patches: TilePatch[];
}
