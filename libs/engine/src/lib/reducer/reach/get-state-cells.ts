import { isSolid, type Level, type Player, TILE_SIZE } from '@mander/model';
import { filter, flatMap, map, round } from 'lodash-es';
import { match } from 'ts-pattern';

import { getTileRange } from '../collision/get-tile-range';
import { PLAYER_HEIGHT, PLAYER_WIDTH } from '../player/consts';
import { getCellIndex } from './get-cell-index';

const getBodyCells = (tiles: Level, player: Player): number[] =>
  flatMap(getTileRange(player.position.y, PLAYER_HEIGHT), (row) =>
    map(getTileRange(player.position.x, PLAYER_WIDTH), (col) =>
      getCellIndex(tiles, row, col),
    ),
  );

const getFootingRow = (player: Player): number =>
  round((player.position.y + PLAYER_HEIGHT) / TILE_SIZE);

const getFootingCells = (tiles: Level, player: Player): number[] =>
  match(player.statuses.isGrounded)
    .with(false, (): number[] => [])
    .otherwise(() =>
      map(
        filter(getTileRange(player.position.x, PLAYER_WIDTH), (col) =>
          isSolid(tiles, col, getFootingRow(player)),
        ),
        (col) => getCellIndex(tiles, getFootingRow(player), col),
      ),
    );

export const getStateCells = (tiles: Level, player: Player): number[] => [
  ...getBodyCells(tiles, player),
  ...getFootingCells(tiles, player),
];
