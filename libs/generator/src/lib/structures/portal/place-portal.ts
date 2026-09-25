import type { Tile } from '@mander/model';
import { flow } from 'lodash-es';
import { createColumnNumbers } from './internal/create-column-numbers';
import { createPortalCandidates } from './internal/create-portal-candidates';
import { createPortalPatches } from './internal/create-portal-patches';
import { findPortalCandidate } from './internal/find-portal-candidate';
import { patchPortalTiles } from './internal/patch-portal-tiles';
import { sortColumnNumbersByPriority } from './internal/sort-column-numbers-by-priority';

export const placePortal = (tiles: Tile[][]) =>
  flow(
    createColumnNumbers,
    sortColumnNumbersByPriority,
    createPortalCandidates,
    findPortalCandidate,
    createPortalPatches,
    patchPortalTiles,
  )(tiles);
