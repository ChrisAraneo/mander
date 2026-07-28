import type { Rect } from '../geometry/rect';
import type { TilePosition } from '../geometry/tile-position';
import { TILE_SIZE } from './constants';

export interface EntityBox {
  offsetX: number;
  offsetY: number;
  width: number;
  height: number;
}

export const CHEST_BOX: EntityBox = {
  offsetX: 3,
  offsetY: -22,
  width: 26,
  height: 22,
};

export const KEY_BOX: EntityBox = {
  offsetX: 7,
  offsetY: -34,
  width: 18,
  height: 22,
};

export const PORTAL_BOX: EntityBox = {
  offsetX: 0,
  offsetY: -64,
  width: 40,
  height: 64,
};

export const entityRect = (tile: TilePosition, box: EntityBox): Rect => ({
  x: tile.x * TILE_SIZE + box.offsetX,
  y: (tile.y + 1) * TILE_SIZE + box.offsetY,
  width: box.width,
  height: box.height,
});
