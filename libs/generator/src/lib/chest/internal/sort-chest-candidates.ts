import { sortBy } from 'lodash-es';
import { match } from 'ts-pattern';
import type { filterChestCandidatesByPortal } from './filter-chest-candidates-by-portal';

export const sortChestCandidates = ({
  tiles,
  levelType,
  candidates,
}: ReturnType<typeof filterChestCandidatesByPortal>) => ({
  tiles,
  candidates: match(levelType)
    .with('HORIZONTAL', () =>
      sortBy(candidates, (candidate) => -candidate.column),
    )
    .with('VERTICAL', () => sortBy(candidates, (candidate) => candidate.row))
    .exhaustive(),
});
