import type { Tile } from '@mander/model';
import type { TilePatch } from '../../../types/tile-patch';

export interface SpikePatch {
  tiles: Tile[][];
  patches: TilePatch[];
}
