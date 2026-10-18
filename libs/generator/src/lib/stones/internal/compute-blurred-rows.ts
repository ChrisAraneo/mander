import { chain } from '@mander/model';
import { map, size, times } from 'lodash-es';
import { computeClampedIndex } from './compute-clamped-index';
import { computeTapAverage } from './compute-tap-average';
import type { Field } from './types/field';

export const computeBlurredRows = (field: Field): Field =>
  map(field, (cells) =>
    chain(size(cells) - 1)
      .thru((edge) =>
        times(size(cells), (column) =>
          computeTapAverage(
            (offset) => cells[computeClampedIndex(column + offset, edge)],
          ),
        ),
      )
      .value(),
  );
