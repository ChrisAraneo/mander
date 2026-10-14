import type { Tile } from '@mander/model';
import type { PaddingSize } from './padding-size';

export interface PaddingSky {
  tiles: Tile[][];
  padding: PaddingSize;
  floor: Tile[] | undefined;
  sky: Tile[][];
}
