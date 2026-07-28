import type { Item } from '../items/item';
import type { Palette } from './palette';
import type { Point } from '../geometry/point';
import type { Rect } from '../geometry/rect';
import type { Tile } from './tile';

export interface Level {
  seed: string;
  width: number;
  height: number;
  tiles: Tile[][];
  palette: Palette;
  spawn: Point;
  chest: Rect;
  portal: Rect;
  key: Rect;
  chestItems: Item[];
  enemies: Point[];
}
