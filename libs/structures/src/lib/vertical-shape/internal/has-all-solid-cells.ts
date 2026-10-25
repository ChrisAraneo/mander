import { isSolidTile, TILE_AIR } from '@mander/model';
import { every } from 'lodash-es';
import type { Layer } from '../../types/layer';

export const hasAllSolidCells = (
  structure: Layer,
  row: number,
  columns: readonly number[],
): boolean =>
  every(columns, (column) => isSolidTile(structure[row]?.[column] ?? TILE_AIR));
