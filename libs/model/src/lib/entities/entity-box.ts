import type { Point, Rectangle } from '@mander/utils';
import { TILE_SIZE } from '../tiles/consts';

export interface EntityBox {
  offsetX: number;
  offsetY: number;
  width: number;
  height: number;
}

export const entityRectangle = (tile: Point, box: EntityBox): Rectangle => ({
  x: tile.x * TILE_SIZE + box.offsetX,
  y: (tile.y + 1) * TILE_SIZE + box.offsetY,
  width: box.width,
  height: box.height,
});
