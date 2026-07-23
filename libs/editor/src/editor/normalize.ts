import {
  AIR,
  BLOCK,
  ENEMY,
  SECTOR_WIDTH,
  type Structure,
  STRUCTURE_HEIGHT,
} from '@mander/generator';
import { concat, isArray, map, some, times } from 'lodash-es';

const isRows = (value: unknown): value is unknown[][] =>
  isArray(value) && !some(value, (row) => !isArray(row));

export const normalize = (data: unknown): Structure | null => {
  if (!isRows(data)) return null;
  const rows = map(data, (row) =>
    map(row, (value) => (value === BLOCK || value === ENEMY ? value : AIR)),
  );
  if (some(rows, (row) => row.length !== SECTOR_WIDTH)) return null;
  if (rows.length === STRUCTURE_HEIGHT) return rows;
  if (rows.length < STRUCTURE_HEIGHT) {
    const padding = times(STRUCTURE_HEIGHT - rows.length, () =>
      Array.from({ length: SECTOR_WIDTH }, (): number => AIR),
    );
    return concat(padding, rows);
  }
  return rows.slice(rows.length - STRUCTURE_HEIGHT);
};
