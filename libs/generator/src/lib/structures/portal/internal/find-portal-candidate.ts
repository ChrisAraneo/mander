import { find, isEmpty } from 'lodash-es';
import type { createPortalCandidates } from './create-portal-candidates';

export const findPortalCandidate = ({
  tiles,
  candidates,
}: ReturnType<typeof createPortalCandidates>) => ({
  tiles,
  found: find(candidates, ({ rows }) => !isEmpty(rows)),
});
