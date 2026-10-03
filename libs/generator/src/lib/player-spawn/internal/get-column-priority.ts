import { indexOf, size } from 'lodash-es';
import { match } from 'ts-pattern';
import type { Spot } from '../../types/spot';

const PREFERRED_SPAWN_COLUMNS = [1, 2, 3, 0, 4, 5];

const NOT_FOUND = -1;

export const getColumnPriority = ({ column }: Spot): number =>
  match(indexOf(PREFERRED_SPAWN_COLUMNS, column))
    .with(NOT_FOUND, () => size(PREFERRED_SPAWN_COLUMNS) + column)
    .otherwise((priority) => priority);
