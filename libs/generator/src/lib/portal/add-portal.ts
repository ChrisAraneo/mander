import type { Tile } from '@mander/model';
import { flow } from 'lodash-es';
import type { LevelType } from '../types/level-type';
import { createPortalPatches } from './internal/create-portal-patches';
import { filterPortalCandidates } from './internal/filter-portal-candidates';
import { getTopPortalCandidate } from './internal/get-top-portal-candidate';
import { patchPortalTiles } from './internal/patch-portal-tiles';
import { sortPortalCandidates } from './internal/sort-portal-candidates';

export const addPortal = (tiles: Tile[][], levelType: LevelType): Tile[][] =>
  flow(
    filterPortalCandidates,
    sortPortalCandidates,
    getTopPortalCandidate,
    createPortalPatches,
    patchPortalTiles,
  )({ tiles, levelType });
