import type { Tile } from '@mander/model';
import { flow } from 'lodash-es';
import type { LevelType } from '../types/level-type';
import { createKeyPatches } from './internal/create-key-patches';
import { filterKeyCandidates } from './internal/filter-key-candidates';
import { getTopKeyCandidate } from './internal/get-top-key-candidate';
import { patchKeyTiles } from './internal/patch-key-tiles';
import { sortKeyCandidates } from './internal/sort-key-candidates';

export const addKey = (tiles: Tile[][], levelType: LevelType): Tile[][] =>
  flow(
    filterKeyCandidates,
    sortKeyCandidates,
    getTopKeyCandidate,
    createKeyPatches,
    patchKeyTiles,
  )({ tiles, levelType });
