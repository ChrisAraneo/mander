import { map } from 'lodash-es';
import { findValidPortalRows } from './find-valid-portal-rows';
import type { sortColumnNumbersByPriority } from './sort-column-numbers-by-priority';

export const createPortalCandidates = ({
  tiles,
  columns,
}: ReturnType<typeof sortColumnNumbersByPriority>) => ({
  tiles,
  candidates: map(columns, (column) => ({
    column,
    rows: findValidPortalRows(tiles, column),
  })),
});
