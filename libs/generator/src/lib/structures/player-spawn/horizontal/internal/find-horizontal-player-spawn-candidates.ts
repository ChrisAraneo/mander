import { isSolidTile, SPAWN_HEIGHT, type Tile } from '@mander/model';
import { filter, findIndex } from 'lodash-es';
import { findStandingSpots } from '../../../find-standing-spots';

// only the top block of each column counts, so there is nothing solid above
// the player when they spawn
const isSurface = (tiles: Tile[][], row: number, column: number) =>
  row === findIndex(tiles, (cells) => isSolidTile(cells[column]));

export const findHorizontalPlayerSpawnCandidates = (tiles: Tile[][]) => ({
  tiles,
  candidates: filter(
    findStandingSpots(tiles, SPAWN_HEIGHT),
    ({ row, column }) => isSurface(tiles, row, column),
  ),
});
