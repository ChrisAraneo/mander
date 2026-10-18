import type { Tile } from '@mander/model';
import { flow } from 'lodash-es';
import type { LevelType } from '../types/level-type';
import { createPlayerSpawnPatches } from './internal/create-player-spawn-patches';
import { filterPlayerSpawnCandidates } from './internal/filter-player-spawn-candidates';
import { getTopPlayerSpawnCandidate } from './internal/get-top-player-spawn-candidate';
import { patchPlayerSpawnTiles } from './internal/patch-player-spawn-tiles';
import { sortPlayerSpawnCandidates } from './internal/sort-player-spawn-candidates';

export const addPlayerSpawn = (
  tiles: Tile[][],
  levelType: LevelType,
): Tile[][] =>
  flow(
    filterPlayerSpawnCandidates,
    sortPlayerSpawnCandidates,
    getTopPlayerSpawnCandidate,
    createPlayerSpawnPatches,
    patchPlayerSpawnTiles,
  )({ tiles, levelType });
