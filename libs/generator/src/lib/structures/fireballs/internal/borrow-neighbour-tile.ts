import { type Tile, TILE_BRICK } from '@mander/model';
import { find } from 'lodash-es';
import { findNeighbourTiles } from '../../find-neighbour-tiles';
import { isBorrowableTile } from './is-borrowable-tile';

export const borrowNeighbourTile = (
  tiles: Tile[][],
  row: number,
  column: number,
) =>
  find(findNeighbourTiles(tiles, row, column), isBorrowableTile) ?? TILE_BRICK;
