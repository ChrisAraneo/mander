import { sortBy } from 'lodash-es';
import { match } from 'ts-pattern';
import type { filterChestCandidates } from './filter-chest-candidates';

export const sortChestCandidates = ({
  tiles,
  levelType,
  candidates,
}: ReturnType<typeof filterChestCandidates>) => ({
  tiles,
  candidates: match(levelType)
    .with('HORIZONTAL', () =>
      sortBy(candidates, (candidate) => -candidate.column),
    )
    .with('VERTICAL', () => sortBy(candidates, (candidate) => candidate.row))
    .exhaustive(),
});
