import { chain, indexOf, sortBy } from 'lodash-es';
import { match } from 'ts-pattern';
import type { createColumnNumbers } from './create-column-numbers';

const PREFERRED_SPAWN_COLUMNS = [1, 2, 3, 0, 4, 5];

export const sortColumnNumbersByPriority = ({
  tiles,
  columns,
}: ReturnType<typeof createColumnNumbers>) => ({
  tiles,
  columns: sortBy(columns, (column) =>
    chain(indexOf(PREFERRED_SPAWN_COLUMNS, column)).thru((priority) =>
      match(priority)
        .when(
          (value) => value === -1,
          () => PREFERRED_SPAWN_COLUMNS.length + column,
        )
        .otherwise(() => priority),
    ),
  ),
});
