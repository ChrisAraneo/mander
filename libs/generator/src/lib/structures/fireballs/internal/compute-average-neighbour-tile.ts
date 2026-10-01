import { type Tile, TILE_BRICK } from '@mander/model';
import { chain } from '@mander/utils';
import { filter, maxBy, size, uniq } from 'lodash-es';
import { findNeighbourTiles } from '../../find-neighbour-tiles';
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
  chain(filter(findNeighbourTiles(tiles, row, column), isAverageableTile))
    .thru((solid) => maxBy(uniq(solid), (tile) => countOf(solid, tile)))
    .thru((average) => average ?? TILE_BRICK)
    .value();
