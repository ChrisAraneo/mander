import { sortBy } from 'lodash-es';
import { match } from 'ts-pattern';
import { findColumnPriority } from './find-column-priority';
import { sortVerticalPlayerSpawnCandidates } from './sort-vertical-player-spawn-candidates';
import type { PlayerSpawnCandidates } from './types/player-spawn-candidates';
import type { SortedPlayerSpawnCandidates } from './types/sorted-player-spawn-candidates';

export const sortPlayerSpawnCandidates = ({
  tiles,
  levelType,
  candidates,
}: PlayerSpawnCandidates): SortedPlayerSpawnCandidates => ({
  tiles,
  candidates: match(levelType)
    .with('HORIZONTAL', () => sortBy(candidates, findColumnPriority))
    .with('VERTICAL', () =>
      sortVerticalPlayerSpawnCandidates(tiles, candidates),
    )
    .exhaustive(),
});
