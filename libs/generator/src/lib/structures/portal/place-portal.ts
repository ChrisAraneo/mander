import type { Tile } from '@mander/model';
import { flow } from 'lodash-es';
import type { LevelType } from '../get-level-type';
import { createPortalPatches } from './internal/create-portal-patches';
import { findPortalCandidates } from './internal/find-portal-candidates';
import { patchPortalTiles } from './internal/patch-portal-tiles';
import { pickPortalCandidate } from './internal/pick-portal-candidate';
import { sortPortalCandidates } from './internal/sort-portal-candidates';

export const placePortal = (tiles: Tile[][], levelType: LevelType) =>
  flow(
    findPortalCandidates,
    sortPortalCandidates,
    pickPortalCandidate,
    createPortalPatches,
    patchPortalTiles,
  )({ tiles, levelType });
