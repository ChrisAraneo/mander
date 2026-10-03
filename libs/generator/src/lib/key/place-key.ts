import type { Tile } from '@mander/model';
import { flow } from 'lodash-es';
import type { LevelType } from '../types/level-type';
import { createKeyPatches } from './internal/create-key-patches';
import { findKeyCandidates } from './internal/find-key-candidates';
import { patchKeyTiles } from './internal/patch-key-tiles';
import { pickKeyCandidate } from './internal/pick-key-candidate';
import { sortKeyCandidates } from './internal/sort-key-candidates';

export const placeKey = (tiles: Tile[][], levelType: LevelType) =>
  flow(
    findKeyCandidates,
    sortKeyCandidates,
    pickKeyCandidate,
    createKeyPatches,
    patchKeyTiles,
  )({ tiles, levelType });
