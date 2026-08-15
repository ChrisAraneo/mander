import type { Tile } from '@mander/model';
import { map, reverse } from 'lodash-es';

export const mirrorTiles = (tiles: Tile[][]): Tile[][] =>
  map(tiles, (row) => reverse([...row]));
