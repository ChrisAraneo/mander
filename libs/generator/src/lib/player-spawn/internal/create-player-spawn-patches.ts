import { SPAWN_HEIGHT, TILE_SPAWN } from '@mander/model';
import { match, P } from 'ts-pattern';
import { createStandingPatches } from '../../structures/create-standing-patches';
import type { PlayerSpawnPatch } from './types/player-spawn-patch';
import type { TopPlayerSpawnCandidate } from './types/top-player-spawn-candidate';

const { nullish } = P;

export const createPlayerSpawnPatches = ({
  tiles,
  candidate,
}: TopPlayerSpawnCandidate): PlayerSpawnPatch => ({
  tiles,
  patches: match(candidate)
    .with(nullish, () => [])
    .otherwise((found) =>
      createStandingPatches(found, TILE_SPAWN, SPAWN_HEIGHT),
    ),
});
