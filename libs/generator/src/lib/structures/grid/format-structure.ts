import { join, map } from 'lodash-es';
import type { Structure } from '../types';

export function formatStructure(grid: Structure): string {
  const rows = map(grid, (row) => `  [${join(row, ', ')}],`);
  return `[\n${join(rows, '\n')}\n]`;
}
