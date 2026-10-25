import { map, size, times } from 'lodash-es';
import { pipe } from 'remeda';
import { computeClampedIndex } from './compute-clamped-index';
import { computeTapAverage } from './compute-tap-average';
import type { Field } from './types/field';

export const computeBlurredColumns = (field: Field): Field =>
  pipe(
    field,
    size,
    (height) => height - 1,
    (edge) =>
      map(field, (cells, row) =>
        times(size(cells), (column) =>
          computeTapAverage(
            (offset) => field[computeClampedIndex(row + offset, edge)][column],
          ),
        ),
      ),
  );
