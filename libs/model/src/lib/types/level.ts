import type { Item } from '../items/types/item';
import type { LevelMeta } from './level-meta';
import type { Tile } from './tile';

export interface Level {
  seed: string;
  width: number;
  height: number;
  tiles: Tile[][];
  backTiles?: Tile[][];
  chestItems: Item[];
  isOpenSided?: boolean;
  meta?: LevelMeta;
}
