import { isSolidTile, type Tile } from '@mander/model';
import { findIndex } from 'lodash-es';

export const isSurface = (tiles: Tile[][], row: number, column: number) =>
  row === findIndex(tiles, (cells) => isSolidTile(cells[column]));
