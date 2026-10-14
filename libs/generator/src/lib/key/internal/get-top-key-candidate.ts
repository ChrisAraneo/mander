import { head } from 'lodash-es';
import type { SortedKeyCandidates } from './types/sorted-key-candidates';
import type { TopKeyCandidate } from './types/top-key-candidate';

export const getTopKeyCandidate = ({
  tiles,
  candidates,
}: SortedKeyCandidates): TopKeyCandidate => ({
  tiles,
  candidate: head(candidates),
});
