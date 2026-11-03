import { isSolidTile, TILE_CANNON_TRIPLE, TILE_SAND } from '@mander/model';
import { includes } from 'lodash-es';

const UNPLACEABLE_TILES = [TILE_CANNON_TRIPLE, TILE_SAND];

export const isPlaceableBlock = (cell: number): boolean =>
  isSolidTile(cell) && !includes(UNPLACEABLE_TILES, cell);
