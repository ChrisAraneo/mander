import { findIndex } from 'lodash-es';
import { match, P } from 'ts-pattern';

import { PLAYER_HEIGHT, PLAYER_WIDTH } from '../state';
import type { Player } from '../state';
import { isSolid, type Level, TILE_SIZE } from '@mander/model';
import { standingPlayer } from './standing-player';

const ENTRY_COLUMN = 0;

const ENTRY_INSET = (TILE_SIZE - PLAYER_WIDTH) / 2;

export const entryPlayer = (tiles: Level): Player | null =>
  match(findIndex(tiles.tiles, (_, row) => isSolid(tiles, ENTRY_COLUMN, row)))
    .with(P.number.lt(0), () => null)
    .otherwise((row) =>
      standingPlayer(ENTRY_INSET, row * TILE_SIZE - PLAYER_HEIGHT),
    );
