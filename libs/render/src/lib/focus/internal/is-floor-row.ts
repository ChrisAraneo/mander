import { type Tile, isSolidTile } from '@mander/model';
import { size, filter } from 'lodash-es';

export const isFloorRow = (row: Tile[]): boolean =>
  size(filter(row, isSolidTile)) * 2 > size(row);
