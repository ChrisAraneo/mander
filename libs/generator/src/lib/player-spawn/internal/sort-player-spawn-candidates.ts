import { sortBy } from 'lodash-es';
import { match } from 'ts-pattern';
import type { filterPlayerSpawnCandidates } from './filter-player-spawn-candidates';
import { findColumnPriority } from './find-column-priority';
import { sortVerticalPlayerSpawnCandidates } from './sort-vertical-player-spawn-candidates';

export const sortPlayerSpawnCandidates = ({
  tiles,
  levelType,
  candidates,
}: ReturnType<typeof filterPlayerSpawnCandidates>) => ({
  tiles,
  candidates: match(levelType)
    .with('HORIZONTAL', () => sortBy(candidates, findColumnPriority))
    .with('VERTICAL', () =>
      sortVerticalPlayerSpawnCandidates(tiles, candidates),
    )
    .exhaustive(),
});
