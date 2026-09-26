import type { Tile } from '@mander/model';
import { flow } from 'lodash-es';
import { createPlayerSpawnPatches } from '../shared/create-player-spawn-patches';
import { patchPlayerSpawnTiles } from '../shared/patch-player-spawn-tiles';
import { pickPlayerSpawnCandidate } from '../shared/pick-player-spawn-candidate';
import { findHorizontalPlayerSpawnCandidates } from './internal/find-horizontal-player-spawn-candidates';
import { sortHorizontalPlayerSpawnCandidates } from './internal/sort-horizontal-player-spawn-candidates';

export const placeHorizontalPlayerSpawn = (tiles: Tile[][]) =>
  flow(
    findHorizontalPlayerSpawnCandidates,
    sortHorizontalPlayerSpawnCandidates,
    pickPlayerSpawnCandidate,
    createPlayerSpawnPatches,
    patchPlayerSpawnTiles,
  )(tiles);
