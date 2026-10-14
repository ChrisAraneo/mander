import type { Tile } from '@mander/model';
import type { PaddingSize } from './padding-size';

export interface PaddingFloor {
  tiles: Tile[][];
  padding: PaddingSize;
  floor: Tile[] | undefined;
}
