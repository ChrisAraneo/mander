import { sortBy } from 'lodash-es';
import { match } from 'ts-pattern';
import { getMiddleColumn } from '../../get-middle-column';
import type { findPlayerSpawnCandidates } from './find-player-spawn-candidates';
import { getColumnPriority } from './get-column-priority';

export const sortPlayerSpawnCandidates = ({
  tiles,
  levelType,
  candidates,
}: ReturnType<typeof findPlayerSpawnCandidates>) => ({
  tiles,
  candidates: match(levelType)
    .with('HORIZONTAL', () => sortBy(candidates, getColumnPriority))
    .with('VERTICAL', () =>
      sortBy(candidates, [
        (candidate) => -candidate.row,
        (candidate) => Math.abs(candidate.column - getMiddleColumn(tiles)),
      ]),
    )
    .exhaustive(),
});
