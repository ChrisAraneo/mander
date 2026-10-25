import { type Tile, TILE_BRICK } from '@mander/model';
import { filter, maxBy, size, uniq } from 'lodash-es';
import { pipe } from 'remeda';
import { getNeighbourTiles } from '../../structures/get-neighbour-tiles';
import { isAverageableTile } from './is-averageable-tile';

const countOf = (
  neighbours: (Tile | undefined)[],
  tile: Tile | undefined,
): number => size(filter(neighbours, (other) => other === tile));

export const computeAverageNeighbourTile = (
  tiles: Tile[][],
  row: number,
  column: number,
): Tile =>
  pipe(
    filter(getNeighbourTiles(tiles, row, column), isAverageableTile),
    (solid) => maxBy(uniq(solid), (tile) => countOf(solid, tile)),
    (average) => average ?? TILE_BRICK,
  );
