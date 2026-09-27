import { isSolidTile, PORTAL_HEIGHT, type Tile } from '@mander/model';
import { filter, findIndex } from 'lodash-es';
import { findStandingSpots } from '../../../find-standing-spots';

const isSurface = (tiles: Tile[][], row: number, column: number) =>
  row === findIndex(tiles, (cells) => isSolidTile(cells[column]));

export const findHorizontalPortalCandidates = (tiles: Tile[][]) => ({
  tiles,
  candidates: filter(
    findStandingSpots(tiles, PORTAL_HEIGHT),
    ({ row, column }) => isSurface(tiles, row, column),
  ),
});
