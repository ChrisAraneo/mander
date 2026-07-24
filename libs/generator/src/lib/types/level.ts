import type { Palette } from '../palette';
import type { Item } from './item';
import type { Point } from './point';
import type { Rect } from './rect';
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
