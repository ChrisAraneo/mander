import { constant } from 'lodash-es';
import { match, P } from 'ts-pattern';
import type { GameLevel } from '../../../types/game-level';
import type { RecordableAction } from '../../types/recordable-action';
import type { PackedEntry } from '../types/packed-entry';
import { getLevelAt } from './get-level-at';

const { nonNullable } = P;

export const tryParseLoadLevelAction = (
  entry: PackedEntry,
  levels: GameLevel[],
): RecordableAction | undefined =>
  match(getLevelAt(levels, entry[2]))
    .with(nonNullable, (level): RecordableAction => ({
      type: 'LOAD_LEVEL',
      level,
      levelIndex: entry[2],
    }))
    .otherwise(constant(undefined));
