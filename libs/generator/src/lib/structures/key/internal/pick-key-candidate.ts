import { head } from 'lodash-es';
import type { sortKeyCandidates } from './sort-key-candidates';

export const pickKeyCandidate = ({
  tiles,
  candidates,
}: ReturnType<typeof sortKeyCandidates>) => ({
  tiles,
  candidate: head(candidates),
});
