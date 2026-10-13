import { match } from 'ts-pattern';
import type { filterPortalCandidates } from './filter-portal-candidates';
import { sortHorizontalPortalCandidates } from './sort-horizontal-portal-candidates';
import { sortVerticalPortalCandidates } from './sort-vertical-portal-candidates';

export const sortPortalCandidates = ({
  tiles,
  levelType,
  candidates,
}: ReturnType<typeof filterPortalCandidates>) => ({
  tiles,
  candidates: match(levelType)
    .with('HORIZONTAL', () => sortHorizontalPortalCandidates(tiles, candidates))
    .with('VERTICAL', () => sortVerticalPortalCandidates(tiles, candidates))
    .exhaustive(),
});
