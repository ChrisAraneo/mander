import type { Tile } from '@mander/model';
import { flow } from 'lodash-es';
import type { LevelType } from '../types/level-type';
import { createGemPatches } from './internal/create-gem-patches';
import { findGemCandidates } from './internal/find-gem-candidates';
import { groupGemCandidates } from './internal/group-gem-candidates';
import { patchGemTiles } from './internal/patch-gem-tiles';
import { pickGemCandidates } from './internal/pick-gem-candidates';
import { shuffleGemCandidates } from './internal/shuffle-gem-candidates';

export const placeGems = (tiles: Tile[][], levelType: LevelType) =>
  flow(
    findGemCandidates,
    groupGemCandidates,
    shuffleGemCandidates,
    pickGemCandidates,
    createGemPatches,
    patchGemTiles,
  )({ tiles, levelType });
