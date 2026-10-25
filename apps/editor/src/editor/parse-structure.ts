import type { Layers } from '@mander/model';
import { pipe } from 'remeda';
import { findBoundary } from './internal/find-boundary';
import { parseStructureRows } from './internal/parse-structure-rows';
import { sliceRowsAfter } from './internal/slice-rows-after';
import { sliceRowsBefore } from './internal/slice-rows-before';

export const parseStructure = (text: string): Layers =>
  pipe(
    text,
    (source) => ({
      rows: parseStructureRows(source),
      boundary: findBoundary(source),
    }),
    ({ rows, boundary }): Layers => ({
      tiles: sliceRowsBefore(rows, boundary),
      backTiles: sliceRowsAfter(rows, boundary),
    }),
  );
