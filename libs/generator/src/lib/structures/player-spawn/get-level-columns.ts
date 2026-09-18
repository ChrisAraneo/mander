import type { Tile } from '@mander/model';
import { range, size } from 'lodash-es';

export const getLevelColumns = (tiles: Tile[][]): number[] =>
  range(size(tiles[0]));
