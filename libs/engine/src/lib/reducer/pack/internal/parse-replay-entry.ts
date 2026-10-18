import { constant } from 'lodash-es';
import { match, P } from 'ts-pattern';
import type { GameLevel } from '../../../types/game-level';
import type { RecordedAction } from '../../recorder/types/recorded-action';
import type { PackedEntry } from '../types/packed-entry';
import { parseReplayAction } from './parse-replay-action';

const { nonNullable } = P;

export const parseReplayEntry = (
  entry: PackedEntry,
  levels: GameLevel[],
): RecordedAction | undefined =>
  match(parseReplayAction(entry, levels))
    .with(nonNullable, (action): RecordedAction => ({
      atStep: entry[0],
      action,
    }))
    .otherwise(constant(undefined));
