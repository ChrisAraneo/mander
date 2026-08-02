import type { Point, Rectangle } from '@mander/utils';
import type { EntityBox } from './entity-box';
import { TILE_SIZE } from '../tile/consts';

export const toEntityRectangle = (tile: Point, box: EntityBox): Rectangle => ({
  x: tile.x * TILE_SIZE + box.offsetX,
  y: (tile.y + 1) * TILE_SIZE + box.offsetY,
  width: box.width,
  height: box.height,
});
