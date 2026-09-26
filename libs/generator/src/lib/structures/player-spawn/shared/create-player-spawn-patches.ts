import { SPAWN_HEIGHT, TILE_SPAWN } from '@mander/model';
import { match, P } from 'ts-pattern';
import { standTiles } from '../../stand-tiles';
import type { pickPlayerSpawnCandidate } from './pick-player-spawn-candidate';

const { nullish } = P;

export const createPlayerSpawnPatches = ({
  tiles,
  candidate,
}: ReturnType<typeof pickPlayerSpawnCandidate>) => ({
  tiles,
  patches: match(candidate)
    .with(nullish, () => [])
    .otherwise((found) => standTiles(found, TILE_SPAWN, SPAWN_HEIGHT)),
});
