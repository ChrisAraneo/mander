import { findSpawnTile, type Level, type Player } from '@mander/model';
import { match, P } from 'ts-pattern';
import { findStandingPlayer } from './find-standing-player';

const { nullish } = P;

const ENTRY_COLUMN = 0;

export const findEntryPlayer = (level: Level): Player | undefined =>
  match(findSpawnTile(level))
    .with(nullish, () => findStandingPlayer(level, ENTRY_COLUMN, 0))
    .otherwise((spawn) => findStandingPlayer(level, spawn.x, spawn.y));
