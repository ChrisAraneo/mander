import { constant } from 'lodash-es';
import { match, P } from 'ts-pattern';
import type { GameLevel } from '../../../types/game-level';
import type { RecordableAction } from '../../types/recordable-action';
import { getLevelAt } from './get-level-at';

const { nonNullable } = P;

const FIRST_LEVEL_INDEX = 0;

export const tryParseRestartAction = (
  levels: GameLevel[],
): RecordableAction | undefined =>
  match(getLevelAt(levels, FIRST_LEVEL_INDEX))
    .with(nonNullable, (level): RecordableAction => ({
      type: 'RESTART',
      level,
    }))
    .otherwise(constant(undefined));
