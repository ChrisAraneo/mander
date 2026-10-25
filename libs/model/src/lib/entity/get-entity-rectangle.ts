import { TILE_SIZE } from '../tile/consts';
import type { Point } from '../types/point';
import type { EntityBox } from './types/entity-box';
import type { Rectangle } from './types/rectangle';

export const getEntityRectangle = (tile: Point, box: EntityBox): Rectangle => ({
  x: tile.x * TILE_SIZE + box.offsetX,
  y: (tile.y + 1) * TILE_SIZE + box.offsetY,
  width: box.width,
  height: box.height,
});
