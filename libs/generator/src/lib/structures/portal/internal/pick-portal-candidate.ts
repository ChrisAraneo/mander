import { head } from 'lodash-es';
import type { sortPortalCandidates } from './sort-portal-candidates';

export const pickPortalCandidate = ({
  tiles,
  candidates,
}: ReturnType<typeof sortPortalCandidates>) => ({
  tiles,
  candidate: head(candidates),
});
