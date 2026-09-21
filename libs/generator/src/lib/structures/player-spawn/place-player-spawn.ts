import type { Tile } from '@mander/model';
import { flow } from 'lodash-es';
import { createColumnNumbers } from './internal/create-column-numbers';
import { createPlayerSpawnCandidates } from './internal/create-player-spawn-candidates';
import { createPlayerSpawnPatches } from './internal/create-player-spawn-patches';
import { findPlayerSpawnCandidate } from './internal/find-player-spawn-candidate';
import { patchPlayerSpawnTiles } from './internal/patch-player-spawn-tiles';
import { sortColumnNumbersByPriority } from './internal/sort-column-numbers-by-priority';

export const placePlayerSpawn = (tiles: Tile[][]) =>
  flow(
    createColumnNumbers,
    sortColumnNumbersByPriority,
    createPlayerSpawnCandidates,
    findPlayerSpawnCandidate,
    createPlayerSpawnPatches,
    patchPlayerSpawnTiles,
  )(tiles);
