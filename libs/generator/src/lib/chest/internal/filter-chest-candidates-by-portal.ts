import { match } from 'ts-pattern';
import { filterHorizontalChestCandidates } from './filter-horizontal-chest-candidates';
import { filterVerticalChestCandidates } from './filter-vertical-chest-candidates';
import type { ChestCandidates } from './types/chest-candidates';

export const filterChestCandidatesByPortal = ({
  tiles,
  levelType,
  candidates,
}: ChestCandidates): ChestCandidates => ({
  tiles,
  levelType,
  candidates: match(levelType)
    .with('HORIZONTAL', () =>
      filterHorizontalChestCandidates(tiles, candidates),
    )
    .with('VERTICAL', () => filterVerticalChestCandidates(tiles, candidates))
    .exhaustive(),
});
