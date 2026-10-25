import { map, size, times } from 'lodash-es';
import { pipe } from 'remeda';
import { computeClampedIndex } from './compute-clamped-index';
import { computeTapAverage } from './compute-tap-average';
import type { Field } from './types/field';

export const computeBlurredRows = (field: Field): Field =>
  map(field, (cells) =>
    pipe(
      cells,
      size,
      (width) => width - 1,
      (edge) =>
        times(size(cells), (column) =>
          computeTapAverage(
            (offset) => cells[computeClampedIndex(column + offset, edge)],
          ),
        ),
    ),
  );
