import { sortBy } from 'lodash-es';
import { match } from 'ts-pattern';
import type { ChestCandidates } from './types/chest-candidates';
import type { SortedChestCandidates } from './types/sorted-chest-candidates';

export const sortChestCandidates = ({
  tiles,
  levelType,
  candidates,
}: ChestCandidates): SortedChestCandidates => ({
  tiles,
  candidates: match(levelType)
    .with('HORIZONTAL', () =>
      sortBy(candidates, (candidate) => -candidate.column),
    )
    .with('VERTICAL', () => sortBy(candidates, (candidate) => candidate.row))
    .exhaustive(),
});
