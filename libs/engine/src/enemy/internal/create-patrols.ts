import { createRandom } from '@mander/common';
import type { Enemy } from '@mander/model';
import type { GameLevel } from '../../state/types/game-level';
import { createLevelPatrols } from './create-level-patrols';

export const createPatrols = (level: GameLevel): Enemy[] =>
  createLevelPatrols(level, createRandom(`${level.seed}#enemies`));
