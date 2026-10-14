import { head } from 'lodash-es';
import type { SortedPlayerSpawnCandidates } from './types/sorted-player-spawn-candidates';
import type { TopPlayerSpawnCandidate } from './types/top-player-spawn-candidate';

export const getTopPlayerSpawnCandidate = ({
  tiles,
  candidates,
}: SortedPlayerSpawnCandidates): TopPlayerSpawnCandidate => ({
  tiles,
  candidate: head(candidates),
});
