import { isSolid, type TileMap, TILE_SIZE } from '../world';
import { filter, flatMap, map, round } from 'lodash-es';
import { match } from 'ts-pattern';

import { tileRange } from '../physics/tile-range';
import { PLAYER_HEIGHT, PLAYER_WIDTH } from '../state';
import type { Player } from '../state';
import { cellIndex } from './cell-index';

const bodyCells = (tiles: TileMap, player: Player): number[] =>
  flatMap(tileRange(player.y, PLAYER_HEIGHT), (row) =>
    map(tileRange(player.x, PLAYER_WIDTH), (col) => cellIndex(tiles, row, col)),
  );

const footingRow = (player: Player): number =>
  round((player.y + PLAYER_HEIGHT) / TILE_SIZE);

const footingCells = (tiles: TileMap, player: Player): number[] =>
  match(player.isGrounded)
    .with(false, (): number[] => [])
    .otherwise(() =>
      map(
        filter(tileRange(player.x, PLAYER_WIDTH), (col) =>
          isSolid(tiles, col, footingRow(player)),
        ),
        (col) => cellIndex(tiles, footingRow(player), col),
      ),
    );

export const stateCells = (tiles: TileMap, player: Player): number[] => [
  ...bodyCells(tiles, player),
  ...footingCells(tiles, player),
];
