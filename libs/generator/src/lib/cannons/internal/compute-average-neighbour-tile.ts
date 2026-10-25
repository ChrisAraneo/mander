import { type Tile, TILE_BRICK } from '@mander/model';
import { filter, maxBy, uniq } from 'lodash-es';
import { pipe } from 'remeda';
import { countNeighbourTiles } from '../../structures/count-neighbour-tiles';
import { getNeighbourTiles } from '../../structures/get-neighbour-tiles';
import { isAverageableTile } from './is-averageable-tile';

export const computeAverageNeighbourTile = (
  tiles: Tile[][],
  row: number,
  column: number,
): Tile =>
  pipe(
    filter(getNeighbourTiles(tiles, row, column), isAverageableTile),
    (solid) => maxBy(uniq(solid), (tile) => countNeighbourTiles(solid, tile)),
    (average) => average ?? TILE_BRICK,
  );
