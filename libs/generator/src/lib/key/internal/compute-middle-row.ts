import type { Tile } from '@mander/model';
import { floor, size } from 'lodash-es';

export const computeMiddleRow = (tiles: Tile[][]): number =>
  floor(size(tiles) / 2);
