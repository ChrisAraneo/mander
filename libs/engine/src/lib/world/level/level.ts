import type { Item } from '../items/item';
import type { Palette } from './palette';
import type { Point } from '../geometry/point';
import type { Rect } from '../geometry/rect';
import type { TileMap } from './tile-map';

export interface Level extends TileMap {
  seed: string;
  palette: Palette;
  spawn: Point;
  chest: Rect;
  portal: Rect;
  key: Rect;
  chestItems: Item[];
  enemies: Point[];
}
