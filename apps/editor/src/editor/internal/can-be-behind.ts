import { isSolidTile, TILE_AIR } from '@mander/model';

export const canBeBehind = (cell: number): boolean =>
  cell === TILE_AIR || isSolidTile(cell);
