import { head } from 'lodash-es';
import type { sortChestCandidates } from './sort-chest-candidates';

export const pickChestCandidate = ({
  tiles,
  candidates,
}: ReturnType<typeof sortChestCandidates>) => ({
  tiles,
  candidate: head(candidates),
});
