import { isSolid, type Level, type Player, TILE_SIZE } from '@mander/model';
import { filter, flatMap, map, round } from 'lodash-es';
import { match } from 'ts-pattern';

import { tileRange } from '../collision/tile-range';
import { PLAYER_HEIGHT, PLAYER_WIDTH } from '../player/consts';
import { cellIndex } from './cell-index';

const bodyCells = (tiles: Level, player: Player): number[] =>
  flatMap(tileRange(player.position.y, PLAYER_HEIGHT), (row) =>
    map(tileRange(player.position.x, PLAYER_WIDTH), (col) =>
      cellIndex(tiles, row, col),
    ),
  );

const footingRow = (player: Player): number =>
  round((player.position.y + PLAYER_HEIGHT) / TILE_SIZE);

const footingCells = (tiles: Level, player: Player): number[] =>
  match(player.statuses.isGrounded)
    .with(false, (): number[] => [])
    .otherwise(() =>
      map(
        filter(tileRange(player.position.x, PLAYER_WIDTH), (col) =>
          isSolid(tiles, col, footingRow(player)),
        ),
        (col) => cellIndex(tiles, footingRow(player), col),
      ),
    );

export const stateCells = (tiles: Level, player: Player): number[] => [
  ...bodyCells(tiles, player),
  ...footingCells(tiles, player),
];
