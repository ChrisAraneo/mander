import type { Tile } from '@mander/model';
import type { TilePatch } from '../../../types/tile-patch';

export interface GemPatch {
  tiles: Tile[][];
  patches: TilePatch[];
}
