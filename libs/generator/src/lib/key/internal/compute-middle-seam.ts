import type { Tile } from '@mander/model';
import { STRUCTURE_WIDTH } from '@mander/structures';
import { floor, size } from 'lodash-es';

export const computeMiddleSeam = (tiles: Tile[][]): number =>
  floor(size(tiles[0]) / 2 / STRUCTURE_WIDTH) * STRUCTURE_WIDTH;
