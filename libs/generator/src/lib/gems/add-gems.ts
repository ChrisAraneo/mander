import type { Tile } from '@mander/model';
import type { createRandom } from '@mander/utils';
import { flow } from 'lodash-es';
import type { LevelType } from '../types/level-type';
import { createGemPatches } from './internal/create-gem-patches';
import { filterGemCandidates } from './internal/filter-gem-candidates';
import { filterGemCandidatesApart } from './internal/filter-gem-candidates-apart';
import { patchGemTiles } from './internal/patch-gem-tiles';
import { sortGemCandidatesRandomly } from './internal/sort-gem-candidates-randomly';
import { splitGemCandidates } from './internal/split-gem-candidates';

export const addGems = (
  tiles: Tile[][],
  levelType: LevelType,
  random: ReturnType<typeof createRandom>,
): Tile[][] =>
  flow(
    filterGemCandidates,
    splitGemCandidates,
    sortGemCandidatesRandomly,
    filterGemCandidatesApart,
    createGemPatches,
    patchGemTiles,
  )({ tiles, levelType, random });
