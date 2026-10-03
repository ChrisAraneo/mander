import { chain } from '@mander/utils';
import { map, size, times } from 'lodash-es';
import { clampIndex } from './clamp-index';
import type { Field } from './field';
import { sumTaps } from './sum-taps';

export const blurColumns = (field: Field): Field =>
  chain(size(field) - 1)
    .thru((edge) =>
      map(field, (cells, row) =>
        times(size(cells), (column) =>
          sumTaps((offset) => field[clampIndex(row + offset, edge)][column]),
        ),
      ),
    )
    .value();
