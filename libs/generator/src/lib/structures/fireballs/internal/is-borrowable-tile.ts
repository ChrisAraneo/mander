import { isSolidTile, type Tile, TILE_FIREBALL } from '@mander/model';
import { isUndefined } from 'lodash-es';

export const isBorrowableTile = (tile: Tile | undefined) =>
  !isUndefined(tile) && tile !== TILE_FIREBALL && isSolidTile(tile);
