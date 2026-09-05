import type { Item } from '../items/item';
import type { Tile } from '../tile/tile';
import type { LevelMeta } from './level-meta';

export interface Level {
  seed: string;
  width: number;
  height: number;
  tiles: Tile[][];
  chestItems: Item[];
  isOpenSided?: boolean;
  meta?: LevelMeta;
}
