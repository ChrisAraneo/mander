import { isSolid, type Level, type Player, TILE_SIZE } from '@mander/model';
import { constant, findIndex } from 'lodash-es';
import { match, P } from 'ts-pattern';
import { PLAYER_HEIGHT, PLAYER_WIDTH } from '../../player/consts';
import { createStandingPlayer } from './create-standing-player';

const { number } = P;

const ENTRY_INSET = (TILE_SIZE - PLAYER_WIDTH) / 2;

export const findStandingPlayer = (
  level: Level,
  column: number,
  from: number,
): Player | undefined =>
  match(findIndex(level.tiles, (_, row) => isSolid(level, column, row), from))
    .with(number.lt(0), constant(undefined))
    .otherwise((row) =>
      createStandingPlayer(
        column * TILE_SIZE + ENTRY_INSET,
        row * TILE_SIZE - PLAYER_HEIGHT,
      ),
    );
