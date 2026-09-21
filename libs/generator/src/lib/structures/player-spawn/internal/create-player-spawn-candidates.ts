import { map } from 'lodash-es';
import { findValidSpawnRows } from './find-valid-spawn-rows';
import type { sortColumnNumbersByPriority } from './sort-column-numbers-by-priority';

export const createPlayerSpawnCandidates = ({
  tiles,
  columns,
}: ReturnType<typeof sortColumnNumbersByPriority>) => ({
  tiles,
  candidates: map(columns, (column) => ({
    column,
    rows: findValidSpawnRows(tiles, column),
  })),
});
