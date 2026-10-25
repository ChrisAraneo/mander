import type { Action, GameLevel } from '@mander/engine';
import { size } from 'lodash-es';
import { match } from 'ts-pattern';

const NO_ACTION: Action | undefined = undefined;

export const tryCreateLevelAction = (
  levels: GameLevel[],
  levelIndex: number,
): Action | undefined =>
  match(levelIndex >= size(levels))
    .with(true, () => NO_ACTION)
    .otherwise((): Action => ({
      type: 'LOAD_LEVEL',
      level: levels[levelIndex],
      levelIndex,
    }));
