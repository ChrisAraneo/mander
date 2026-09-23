import { isSolidTile, type Tile, TILE_CANNON } from '@mander/model';
import { isUndefined } from 'lodash-es';

export const isAverageableTile = (tile: Tile | undefined) =>
  !isUndefined(tile) && tile !== TILE_CANNON && isSolidTile(tile);
