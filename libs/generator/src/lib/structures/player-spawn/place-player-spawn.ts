import type { Tile } from '@mander/model';
import { flow } from 'lodash-es';
import type { LevelType } from '../get-level-type';
import { createPlayerSpawnPatches } from './internal/create-player-spawn-patches';
import { findPlayerSpawnCandidates } from './internal/find-player-spawn-candidates';
import { patchPlayerSpawnTiles } from './internal/patch-player-spawn-tiles';
import { pickPlayerSpawnCandidate } from './internal/pick-player-spawn-candidate';
import { sortPlayerSpawnCandidates } from './internal/sort-player-spawn-candidates';

export const placePlayerSpawn = (tiles: Tile[][], levelType: LevelType) =>
  flow(
    findPlayerSpawnCandidates,
    sortPlayerSpawnCandidates,
    pickPlayerSpawnCandidate,
    createPlayerSpawnPatches,
    patchPlayerSpawnTiles,
  )({ tiles, levelType });
