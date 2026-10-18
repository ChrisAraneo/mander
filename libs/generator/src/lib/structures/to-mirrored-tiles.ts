import type { Tile } from '@mander/model';
import { map, reverse } from 'lodash-es';

export const toMirroredTiles = (tiles: Tile[][]): Tile[][] =>
  map(tiles, (row) => reverse([...row]));
