import type { Tile } from '@mander/model';
import { floor, size } from 'lodash-es';

export const getMiddleColumn = (tiles: Tile[][]): number =>
  floor(size(tiles[0] ?? []) / 2);
