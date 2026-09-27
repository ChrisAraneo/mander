import { indexOf } from 'lodash-es';
import { match } from 'ts-pattern';
import type { Spot } from '../../find-standing-spots';

const PREFERRED_SPAWN_COLUMNS = [1, 2, 3, 0, 4, 5];

export const getColumnPriority = ({ column }: Spot) =>
  match(indexOf(PREFERRED_SPAWN_COLUMNS, column))
    .when(
      (priority) => priority === -1,
      () => PREFERRED_SPAWN_COLUMNS.length + column,
    )
    .otherwise((priority) => priority);
