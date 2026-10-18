import { head } from 'lodash-es';
import type { SortedPortalCandidates } from './types/sorted-portal-candidates';
import type { TopPortalCandidate } from './types/top-portal-candidate';

export const getTopPortalCandidate = ({
  tiles,
  candidates,
}: SortedPortalCandidates): TopPortalCandidate => ({
  tiles,
  candidate: head(candidates),
});
