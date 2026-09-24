import { chain } from '@mander/utils';
import { indexOf, size, sortBy } from 'lodash-es';
import { match } from 'ts-pattern';
import type { createColumnNumbers } from './create-column-numbers';

const PREFERRED_PORTAL_OFFSETS = [1, 2, 3, 0];

export const sortColumnNumbersByPriority = ({
  tiles,
  columns,
}: ReturnType<typeof createColumnNumbers>) => ({
  tiles,
  columns: sortBy(columns, (column) =>
    chain(size(tiles[0]) - 1 - column)
      .thru((offset) =>
        match(indexOf(PREFERRED_PORTAL_OFFSETS, offset))
          .when(
            (priority) => priority === -1,
            () => offset,
          )
          .otherwise((priority) => priority),
      )
      .value(),
  ),
});
