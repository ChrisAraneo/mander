import { SPAWN_HEIGHT, TILE_SPAWN } from '@mander/model';
import { match, P } from 'ts-pattern';
import { createStandingPatches } from '../../structures/create-standing-patches';
import type { getTopPlayerSpawnCandidate } from './get-top-player-spawn-candidate';

const { nullish } = P;

export const createPlayerSpawnPatches = ({
  tiles,
  candidate,
}: ReturnType<typeof getTopPlayerSpawnCandidate>) => ({
  tiles,
  patches: match(candidate)
    .with(nullish, () => [])
    .otherwise((found) =>
      createStandingPatches(found, TILE_SPAWN, SPAWN_HEIGHT),
    ),
});
