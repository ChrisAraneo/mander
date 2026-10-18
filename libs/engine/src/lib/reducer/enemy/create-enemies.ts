import { type Enemy } from '@mander/model';
import type { GameLevel } from '../../types/game-level';
import { createBeartraps } from './internal/create-beartraps';
import { createPatrols } from './internal/create-patrols';

export const createEnemies = (level: GameLevel): Enemy[] => [
  ...createPatrols(level),
  ...createBeartraps(level),
];
