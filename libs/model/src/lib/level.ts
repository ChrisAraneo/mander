import type { Item } from './item';
import type { Palette } from './palette';
import type { Point } from './point';
import type { Rect } from './rect';
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
