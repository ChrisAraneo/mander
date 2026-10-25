import type { Random } from '@mander/engine';
import type { Tile } from '@mander/model';
import { pipe } from 'remeda';
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
  random: Random,
): Tile[][] =>
  pipe(
    { tiles, levelType, random },
    filterGemCandidates,
    splitGemCandidates,
    sortGemCandidatesRandomly,
    filterGemCandidatesApart,
    createGemPatches,
    patchGemTiles,
  );
