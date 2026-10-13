import { match } from 'ts-pattern';
import type { filterChestCandidates } from './filter-chest-candidates';
import { filterHorizontalChestCandidates } from './filter-horizontal-chest-candidates';
import { filterVerticalChestCandidates } from './filter-vertical-chest-candidates';

export const filterChestCandidatesByPortal = ({
  tiles,
  levelType,
  candidates,
}: ReturnType<typeof filterChestCandidates>) => ({
  tiles,
  levelType,
  candidates: match(levelType)
    .with('HORIZONTAL', () =>
      filterHorizontalChestCandidates(tiles, candidates),
    )
    .with('VERTICAL', () => filterVerticalChestCandidates(tiles, candidates))
    .exhaustive(),
});
