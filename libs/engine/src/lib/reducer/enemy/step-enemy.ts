import type { Enemy, Level, Player } from '@mander/model';
import { flow } from 'lodash-es';
import { computeEnemyStepDelta } from './internal/compute-enemy-step-delta';
import { computeEnemyStepFall } from './internal/compute-enemy-step-fall';
import { computeEnemyStepHop } from './internal/compute-enemy-step-hop';
import { computeEnemyStepHorizontalMove } from './internal/compute-enemy-step-horizontal-move';
import { computeEnemyStepTurn } from './internal/compute-enemy-step-turn';
import { computeEnemyStepVerticalMove } from './internal/compute-enemy-step-vertical-move';
import { patchEnemyStep } from './internal/patch-enemy-step';

export const stepEnemy = (
  level: Level,
  enemy: Enemy,
  player: Player,
  elapsedSeconds: number,
): Enemy =>
  flow(
    computeEnemyStepDelta,
    computeEnemyStepHop,
    computeEnemyStepTurn,
    computeEnemyStepFall,
    computeEnemyStepHorizontalMove,
    computeEnemyStepVerticalMove,
    patchEnemyStep,
  )({ level, enemy, player, elapsedSeconds });
