import type { Item } from '../items/item';
import type { Tile } from '../tile/tile';
import type { LevelMeta } from './level-meta';

export interface Level {
  seed: string;
  width: number;
  height: number;
  tiles: Tile[][];
  // the layer behind the level: solid tile ids the player passes straight
  // through, drawn dimmed under everything the front layer carries
  backTiles?: Tile[][];
  chestItems: Item[];
  isOpenSided?: boolean;
  meta?: LevelMeta;
}
