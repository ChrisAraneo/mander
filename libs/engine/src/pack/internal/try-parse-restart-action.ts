import { constant } from 'lodash-es';
import { match, P } from 'ts-pattern';
import { FIRST_LEVEL_INDEX } from '../../load-level/consts';
import type { GameLevel } from '../../state/types/game-level';
import type { RecordableAction } from '../../state/types/recordable-action';
import { getLevelAt } from './get-level-at';

const { nonNullable } = P;

export const tryParseRestartAction = (
  levels: GameLevel[],
): RecordableAction | undefined =>
  match(getLevelAt(levels, FIRST_LEVEL_INDEX))
    .with(nonNullable, (level): RecordableAction => ({
      type: 'RESTART',
      level,
    }))
    .otherwise(constant(undefined));
