import { indexOf, sortBy } from 'lodash-es';
import { match } from 'ts-pattern';
import type { findHorizontalPlayerSpawnCandidates } from './find-horizontal-player-spawn-candidates';

const PREFERRED_SPAWN_COLUMNS = [1, 2, 3, 0, 4, 5];

export const sortHorizontalPlayerSpawnCandidates = ({
  tiles,
  candidates,
}: ReturnType<typeof findHorizontalPlayerSpawnCandidates>) => ({
  tiles,
  candidates: sortBy(candidates, ({ column }) =>
    match(indexOf(PREFERRED_SPAWN_COLUMNS, column))
      .when(
        (priority) => priority === -1,
        () => PREFERRED_SPAWN_COLUMNS.length + column,
      )
      .otherwise((priority) => priority),
  ),
});
