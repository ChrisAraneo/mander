import { constant } from 'lodash-es';
import { match, P } from 'ts-pattern';
import type { GameLevel } from '../../state/types/game-level';
import type { RecordableAction } from '../../state/types/recordable-action';
import { PAYLOAD_POSITION } from '../consts';
import type { PackedEntry } from '../types/packed-entry';
import { getLevelAt } from './get-level-at';

const { nonNullable } = P;

export const tryParseLoadLevelAction = (
  entry: PackedEntry,
  levels: GameLevel[],
): RecordableAction | undefined =>
  match(getLevelAt(levels, entry[PAYLOAD_POSITION]))
    .with(nonNullable, (level): RecordableAction => ({
      type: 'LOAD_LEVEL',
      level,
      levelIndex: entry[PAYLOAD_POSITION],
    }))
    .otherwise(constant(undefined));
