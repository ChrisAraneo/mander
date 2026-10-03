import { match } from 'ts-pattern';
import { filterBelowPortal } from './filter-below-portal';
import { filterLeftOfPortal } from './filter-left-of-portal';
import { findAnchorColumn } from './find-anchor-column';
import { findAnchorRow } from './find-anchor-row';
import type { findChestCandidates } from './find-chest-candidates';

export const filterChestCandidates = ({
  tiles,
  levelType,
  candidates,
}: ReturnType<typeof findChestCandidates>) => ({
  tiles,
  levelType,
  candidates: match(levelType)
    .with('HORIZONTAL', () =>
      filterLeftOfPortal(candidates, findAnchorColumn(tiles)),
    )
    .with('VERTICAL', () => filterBelowPortal(candidates, findAnchorRow(tiles)))
    .exhaustive(),
});
