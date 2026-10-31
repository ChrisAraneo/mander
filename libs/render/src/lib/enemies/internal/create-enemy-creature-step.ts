import type { Enemy } from '@mander/model';
import { createConditionalStep } from '../../canvas/create-conditional-step';
import { createSequenceStep } from '../../canvas/create-sequence-step';
import type { CanvasStep } from '../../types/canvas-step';
import { createEnemyBodyStep } from './create-enemy-body-step';
import { createEnemyBrowsStep } from './create-enemy-brows-step';
import { createEnemyEyesStep } from './create-enemy-eyes-step';
import { createEnemyHornsStep } from './create-enemy-horns-step';
import { createEnemyWingsStep } from './create-enemy-wings-step';
import type { EnemyPalette } from './types/enemy-palette';

export const createEnemyCreatureStep = (
  enemy: Enemy,
  palette: EnemyPalette,
  isDying: boolean,
  time: number,
): CanvasStep =>
  createSequenceStep([
    createConditionalStep(enemy.kind === 'FLYING', createEnemyWingsStep(time)),
    createEnemyBodyStep(palette),
    createConditionalStep(
      enemy.kind === 'HORNED' ||
        enemy.kind === 'SHOOTER' ||
        enemy.kind === 'FREEZING',
      createEnemyHornsStep(palette),
    ),
    createEnemyEyesStep(isDying),
    createEnemyBrowsStep(palette),
  ]);
