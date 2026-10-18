import { head } from 'lodash-es';
import type { SortedChestCandidates } from './types/sorted-chest-candidates';
import type { TopChestCandidate } from './types/top-chest-candidate';

export const getTopChestCandidate = ({
  tiles,
  candidates,
}: SortedChestCandidates): TopChestCandidate => ({
  tiles,
  candidate: head(candidates),
});
