import { PORTAL_HEIGHT, type Tile } from '@mander/model';
import { findStandingSpots } from '../../../find-standing-spots';

export const findVerticalPortalCandidates = (tiles: Tile[][]) => ({
  tiles,
  candidates: findStandingSpots(tiles, PORTAL_HEIGHT),
});
