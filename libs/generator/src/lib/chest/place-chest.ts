import type { Tile } from '@mander/model';
import { flow } from 'lodash-es';
import type { LevelType } from '../types/level-type';
import { createChestPatches } from './internal/create-chest-patches';
import { filterChestCandidates } from './internal/filter-chest-candidates';
import { findChestCandidates } from './internal/find-chest-candidates';
import { patchChestTiles } from './internal/patch-chest-tiles';
import { pickChestCandidate } from './internal/pick-chest-candidate';
import { sortChestCandidates } from './internal/sort-chest-candidates';

export const placeChest = (tiles: Tile[][], levelType: LevelType) =>
  flow(
    findChestCandidates,
    filterChestCandidates,
    sortChestCandidates,
    pickChestCandidate,
    createChestPatches,
    patchChestTiles,
  )({ tiles, levelType });
