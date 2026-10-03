import { head } from 'lodash-es';
import type { sortPlayerSpawnCandidates } from './sort-player-spawn-candidates';

export const pickPlayerSpawnCandidate = ({
  tiles,
  candidates,
}: ReturnType<typeof sortPlayerSpawnCandidates>) => ({
  tiles,
  candidate: head(candidates),
});
