import type { Tile } from '@mander/model';
import { flow } from 'lodash-es';
import { createPlayerSpawnPatches } from '../shared/create-player-spawn-patches';
import { patchPlayerSpawnTiles } from '../shared/patch-player-spawn-tiles';
import { pickPlayerSpawnCandidate } from '../shared/pick-player-spawn-candidate';
import { findVerticalPlayerSpawnCandidates } from './internal/find-vertical-player-spawn-candidates';
import { sortVerticalPlayerSpawnCandidates } from './internal/sort-vertical-player-spawn-candidates';

export const placeVerticalPlayerSpawn = (tiles: Tile[][]) =>
  flow(
    findVerticalPlayerSpawnCandidates,
    sortVerticalPlayerSpawnCandidates,
    pickPlayerSpawnCandidate,
    createPlayerSpawnPatches,
    patchPlayerSpawnTiles,
  )(tiles);
