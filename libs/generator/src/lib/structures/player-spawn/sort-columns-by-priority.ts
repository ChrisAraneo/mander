import { chain, indexOf, sortBy } from 'lodash-es';
import { match } from 'ts-pattern';

const PREFERRED_SPAWN_COLUMNS = [1, 2, 3, 0];

export const sortColumnsByPriority = (columns: number[]): number[] =>
  sortBy(columns, (column) =>
    chain(indexOf(PREFERRED_SPAWN_COLUMNS, column)).thru((priority) =>
      match(priority)
        .when(
          (value) => value === -1,
          () => PREFERRED_SPAWN_COLUMNS.length + column,
        )
        .otherwise(() => priority),
    ),
  );
