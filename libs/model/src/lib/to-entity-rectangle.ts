import type { Point, Rectangle } from '@mander/utils';
import { TILE_SIZE } from './blocks/consts';
import type { EntityBox } from './entity-box';

export const toEntityRectangle = (tile: Point, box: EntityBox): Rectangle => ({
  x: tile.x * TILE_SIZE + box.offsetX,
  y: (tile.y + 1) * TILE_SIZE + box.offsetY,
  width: box.width,
  height: box.height,
});
