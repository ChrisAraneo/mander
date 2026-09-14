import { findIndex } from 'lodash-es';
import { match, P } from 'ts-pattern';

import {
  findSpawnTile,
  isSolid,
  type Level,
  type Player,
  TILE_SIZE,
} from '@mander/model';
import { PLAYER_HEIGHT, PLAYER_WIDTH } from '../player/consts';
import { createStandingPlayer } from './create-standing-player';

const { nullish, number } = P;

const ENTRY_COLUMN = 0;

const ENTRY_INSET = (TILE_SIZE - PLAYER_WIDTH) / 2;

const findStandingAt = (
  tiles: Level,
  column: number,
  from: number,
): Player | null =>
  match(findIndex(tiles.tiles, (_, row) => isSolid(tiles, column, row), from))
    .with(number.lt(0), () => null)
    .otherwise((row) =>
      createStandingPlayer(
        column * TILE_SIZE + ENTRY_INSET,
        row * TILE_SIZE - PLAYER_HEIGHT,
      ),
    );

export const findEntryPlayer = (tiles: Level): Player | null =>
  match(findSpawnTile(tiles))
    .with(nullish, () => findStandingAt(tiles, ENTRY_COLUMN, 0))
    .otherwise((spawn) => findStandingAt(tiles, spawn.x, spawn.y));
