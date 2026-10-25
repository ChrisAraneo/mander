import type { Tile } from '@mander/model';
import { pipe } from 'remeda';
import type { LevelType } from '../types/level-type';
import { createPortalPatches } from './internal/create-portal-patches';
import { filterPortalCandidates } from './internal/filter-portal-candidates';
import { getTopPortalCandidate } from './internal/get-top-portal-candidate';
import { patchPortalTiles } from './internal/patch-portal-tiles';
import { sortPortalCandidates } from './internal/sort-portal-candidates';

export const addPortal = (tiles: Tile[][], levelType: LevelType): Tile[][] =>
  pipe(
    { tiles, levelType },
    filterPortalCandidates,
    sortPortalCandidates,
    getTopPortalCandidate,
    createPortalPatches,
    patchPortalTiles,
  );
