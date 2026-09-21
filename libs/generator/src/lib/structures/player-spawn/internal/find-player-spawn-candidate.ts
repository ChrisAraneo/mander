import { find, isEmpty } from 'lodash-es';
import type { createPlayerSpawnCandidates } from './create-player-spawn-candidates';

export const findPlayerSpawnCandidate = ({
  tiles,
  candidates,
}: ReturnType<typeof createPlayerSpawnCandidates>) => ({
  tiles,
  found: find(candidates, ({ rows }) => !isEmpty(rows)),
});
