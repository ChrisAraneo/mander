import type { Tile } from '@mander/model';
import { flow } from 'lodash-es';
import { createPortalPatches } from '../shared/create-portal-patches';
import { patchPortalTiles } from '../shared/patch-portal-tiles';
import { pickPortalCandidate } from '../shared/pick-portal-candidate';
import { findVerticalPortalCandidates } from './internal/find-vertical-portal-candidates';
import { sortVerticalPortalCandidates } from './internal/sort-vertical-portal-candidates';

export const placeVerticalPortal = (tiles: Tile[][]) =>
  flow(
    findVerticalPortalCandidates,
    sortVerticalPortalCandidates,
    pickPortalCandidate,
    createPortalPatches,
    patchPortalTiles,
  )(tiles);
