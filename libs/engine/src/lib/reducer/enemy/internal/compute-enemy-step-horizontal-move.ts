import { computeEnemyHorizontalMove } from './compute-enemy-horizontal-move';
import { createEnemyStepHorizontalMove } from './create-enemy-step-horizontal-move';
import type { EnemyStepHorizontalMove } from './types/enemy-step-horizontal-move';
import type { EnemyStepIntent } from './types/enemy-step-intent';

export const computeEnemyStepHorizontalMove = (
  intent: EnemyStepIntent,
): EnemyStepHorizontalMove =>
  createEnemyStepHorizontalMove(intent, computeEnemyHorizontalMove(intent));
