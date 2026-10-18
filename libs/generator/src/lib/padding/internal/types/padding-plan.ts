import type { Tile } from '@mander/model';
import type { PaddingSize } from './padding-size';

export interface PaddingPlan {
  tiles: Tile[][];
  padding: PaddingSize;
}
