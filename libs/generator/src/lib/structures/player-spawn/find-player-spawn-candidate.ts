import { find, isEmpty } from 'lodash-es';
import type { FoundPlayerSpawn, PlayerSpawnCandidates } from './interfaces';

export const findPlayerSpawnCandidate = ({
  tiles,
  candidates,
}: PlayerSpawnCandidates): FoundPlayerSpawn => ({
  tiles,
  found: find(candidates, ({ rows }) => !isEmpty(rows)),
});
