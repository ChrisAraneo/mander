import type { Tile } from '@mander/model';
import { join, map } from 'lodash-es';

export const formatTilesSeed = (tiles: Tile[][]): string =>
  join(
    map(tiles, (row) => join(row, ',')),
    '|',
  );
