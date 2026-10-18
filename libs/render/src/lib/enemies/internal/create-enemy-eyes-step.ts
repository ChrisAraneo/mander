import { match } from 'ts-pattern';
import { createArcStep } from '../../canvas/create-arc-step';
import { createSequenceStep } from '../../canvas/create-sequence-step';
import { createStyleStep } from '../../canvas/create-style-step';
import { drawBeginPath } from '../../canvas/draw-begin-path';
import { drawFill } from '../../canvas/draw-fill';
import type { CanvasStep } from '../../types/canvas-step';
import { drawEnemyDeadEyes } from './draw-enemy-dead-eyes';
import { drawEnemyLivingEyes } from './draw-enemy-living-eyes';

export const createEnemyEyesStep = (isDying: boolean): CanvasStep =>
  createSequenceStep([
    createStyleStep({ fillStyle: '#FDF3EA' }),
    drawBeginPath,
    createArcStep(-4, -4, 3.2, 0, Math.PI * 2),
    createArcStep(3, -4, 3.2, 0, Math.PI * 2),
    drawFill,
    createStyleStep({ strokeStyle: '#1C1C28', fillStyle: '#1C1C28' }),
    match(isDying)
      .with(true, () => drawEnemyDeadEyes)
      .otherwise(() => drawEnemyLivingEyes),
  ]);
