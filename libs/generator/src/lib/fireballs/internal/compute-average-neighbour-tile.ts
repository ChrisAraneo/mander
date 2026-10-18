import { type Tile, TILE_BRICK, chain } from '@mander/model';
import { filter, maxBy, size, uniq } from 'lodash-es';
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
  chain(filter(getNeighbourTiles(tiles, row, column), isAverageableTile))
    .thru((solid) => maxBy(uniq(solid), (tile) => countOf(solid, tile)))
    .thru((average) => average ?? TILE_BRICK)
    .value();
