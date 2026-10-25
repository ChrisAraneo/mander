import type { Tile } from '@mander/model';
import { pipe } from 'remeda';
import type { LevelType } from '../types/level-type';
import { createChestPatches } from './internal/create-chest-patches';
import { filterChestCandidates } from './internal/filter-chest-candidates';
import { filterChestCandidatesByPortal } from './internal/filter-chest-candidates-by-portal';
import { getTopChestCandidate } from './internal/get-top-chest-candidate';
import { patchChestTiles } from './internal/patch-chest-tiles';
import { sortChestCandidates } from './internal/sort-chest-candidates';

export const addChest = (tiles: Tile[][], levelType: LevelType): Tile[][] =>
  pipe(
    { tiles, levelType },
    filterChestCandidates,
    filterChestCandidatesByPortal,
    sortChestCandidates,
    getTopChestCandidate,
    createChestPatches,
    patchChestTiles,
  );
