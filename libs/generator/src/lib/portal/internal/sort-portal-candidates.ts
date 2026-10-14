import { match } from 'ts-pattern';
import { sortHorizontalPortalCandidates } from './sort-horizontal-portal-candidates';
import { sortVerticalPortalCandidates } from './sort-vertical-portal-candidates';
import type { PortalCandidates } from './types/portal-candidates';
import type { SortedPortalCandidates } from './types/sorted-portal-candidates';

export const sortPortalCandidates = ({
  tiles,
  levelType,
  candidates,
}: PortalCandidates): SortedPortalCandidates => ({
  tiles,
  candidates: match(levelType)
    .with('HORIZONTAL', () => sortHorizontalPortalCandidates(tiles, candidates))
    .with('VERTICAL', () => sortVerticalPortalCandidates(tiles, candidates))
    .exhaustive(),
});
