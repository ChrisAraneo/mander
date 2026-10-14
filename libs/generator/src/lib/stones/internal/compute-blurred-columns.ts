import { chain } from '@mander/utils';
import { map, size, times } from 'lodash-es';
import { computeClampedIndex } from './compute-clamped-index';
import { computeTapAverage } from './compute-tap-average';
import type { Field } from './types/field';

export const computeBlurredColumns = (field: Field): Field =>
  chain(size(field) - 1)
    .thru((edge) =>
      map(field, (cells, row) =>
        times(size(cells), (column) =>
          computeTapAverage(
            (offset) => field[computeClampedIndex(row + offset, edge)][column],
          ),
        ),
      ),
    )
    .value();
