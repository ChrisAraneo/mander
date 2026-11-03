import { TILE_AIR } from '@mander/model';
import { isPlaceableBlock } from './is-placeable-block';

export const canBeBehind = (cell: number): boolean =>
  cell === TILE_AIR || isPlaceableBlock(cell);
