import type { Enemy, Level, Player } from '@mander/model';
import { flow } from 'lodash-es';
import { computeBeartrapStepDelta } from './internal/compute-beartrap-step-delta';
import { computeBeartrapStepFall } from './internal/compute-beartrap-step-fall';
import { computeBeartrapStepHop } from './internal/compute-beartrap-step-hop';
import { computeBeartrapStepVerticalMove } from './internal/compute-beartrap-step-vertical-move';
import { patchBeartrapStep } from './internal/patch-beartrap-step';

export const stepBeartrap = (
  level: Level,
  trap: Enemy,
  player: Player,
  elapsedSeconds: number,
): Enemy =>
  flow(
    computeBeartrapStepDelta,
    computeBeartrapStepHop,
    computeBeartrapStepFall,
    computeBeartrapStepVerticalMove,
    patchBeartrapStep,
  )({ level, trap, player, elapsedSeconds });
