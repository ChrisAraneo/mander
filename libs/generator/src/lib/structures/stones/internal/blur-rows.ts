import { chain } from '@mander/utils';
import { map, size, times } from 'lodash-es';
import { clampIndex } from './clamp-index';
import type { Field } from './field';
import { sumTaps } from './sum-taps';

export const blurRows = (field: Field): Field =>
  map(field, (cells) =>
    chain(size(cells) - 1)
      .thru((edge) =>
        times(size(cells), (column) =>
          sumTaps((offset) => cells[clampIndex(column + offset, edge)]),
        ),
      )
      .value(),
  );
