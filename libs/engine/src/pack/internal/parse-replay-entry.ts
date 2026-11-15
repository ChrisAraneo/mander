import { constant } from 'lodash-es';
import { match, P } from 'ts-pattern';
import type { RecordedAction } from '../../recorder/types/recorded-action';
import type { GameLevel } from '../../state/types/game-level';
import { STEP_POSITION } from '../consts';
import type { PackedEntry } from '../types/packed-entry';
import { parseReplayAction } from './parse-replay-action';

const { nonNullable } = P;

export const parseReplayEntry = (
  entry: PackedEntry,
  levels: GameLevel[],
): RecordedAction | undefined =>
  match(parseReplayAction(entry, levels))
    .with(nonNullable, (action): RecordedAction => ({
      atStep: entry[STEP_POSITION],
      action,
    }))
    .otherwise(constant(undefined));
