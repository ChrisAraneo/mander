import type { Item } from '../items/item';
import type { Tile } from '../tile/tile';

export interface Level {
  seed: string;
  width: number;
  height: number;
  tiles: Tile[][];
  chestItems: Item[];
}
