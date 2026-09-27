import type { Tile } from '@mander/model';
import { flow } from 'lodash-es';
import { createPortalPatches } from '../shared/create-portal-patches';
import { patchPortalTiles } from '../shared/patch-portal-tiles';
import { pickPortalCandidate } from '../shared/pick-portal-candidate';
import { findHorizontalPortalCandidates } from './internal/find-horizontal-portal-candidates';
import { sortHorizontalPortalCandidates } from './internal/sort-horizontal-portal-candidates';

export const placeHorizontalPortal = (tiles: Tile[][]) =>
  flow(
    findHorizontalPortalCandidates,
    sortHorizontalPortalCandidates,
    pickPortalCandidate,
    createPortalPatches,
    patchPortalTiles,
  )(tiles);
