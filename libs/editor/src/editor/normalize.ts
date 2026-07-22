import {
  AIR,
  BLOCK,
  ENEMY,
  SECTOR_WIDTH,
  type Structure,
  STRUCTURE_HEIGHT,
} from '@mander/generator';
import { concat, fill, isArray, map, some, times } from 'lodash-es';

export function normalize(data: unknown): Structure | null {
  if (!isArray(data) || some(data, (row) => !isArray(row))) return null;
  const rows = map(data as unknown[][], (row) =>
    map(row, (value) => (value === BLOCK || value === ENEMY ? value : AIR)),
  );
  if (some(rows, (row) => row.length !== SECTOR_WIDTH)) return null;
  if (rows.length === STRUCTURE_HEIGHT) return rows;
  if (rows.length < STRUCTURE_HEIGHT) {
    const padding = times(STRUCTURE_HEIGHT - rows.length, () =>
      fill(new Array(SECTOR_WIDTH), AIR),
    );
    return concat(padding, rows);
  }
  return rows.slice(rows.length - STRUCTURE_HEIGHT);
}
