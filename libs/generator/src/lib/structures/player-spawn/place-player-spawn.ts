import type { Tile } from '@mander/model';
import { flow } from 'lodash-es';
import { createColumnNumbers } from './create-column-numbers';
import { createPlayerSpawnCandidates } from './create-player-spawn-candidates';
import { createPlayerSpawnPatches } from './create-player-spawn-patches';
import { findPlayerSpawnCandidate } from './find-player-spawn-candidate';
import { patchPlayerSpawnTiles } from './patch-player-spawn-tiles';
import { sortColumnNumbersByPriority } from './sort-column-numbers-by-priority';

export const placePlayerSpawn = (tiles: Tile[][]): Tile[][] =>
  flow(
    createColumnNumbers,
    sortColumnNumbersByPriority,
    createPlayerSpawnCandidates,
    findPlayerSpawnCandidate,
    createPlayerSpawnPatches,
    patchPlayerSpawnTiles,
  )(tiles);
