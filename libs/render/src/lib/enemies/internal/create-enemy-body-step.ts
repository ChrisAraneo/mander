import { ENEMY_WIDTH, ENEMY_HEIGHT } from '@mander/engine';
import { createRectStep } from '../../canvas/create-rect-step';
import { createRoundRectStep } from '../../canvas/create-round-rect-step';
import { createSequenceStep } from '../../canvas/create-sequence-step';
import { createStyleStep } from '../../canvas/create-style-step';
import { drawBeginPath } from '../../canvas/draw-begin-path';
import { drawFill } from '../../canvas/draw-fill';
import { createOutlineStep } from '../../stroke/create-outline-step';
import type { CanvasStep } from '../../types/canvas-step';
import { HALF_WIDTH, HALF_HEIGHT } from './consts';
import type { EnemyPalette } from './types/enemy-palette';

export const createEnemyBodyStep = (palette: EnemyPalette): CanvasStep =>
  createSequenceStep([
    drawBeginPath,
    createRectStep(-HALF_WIDTH + 3, HALF_HEIGHT - 4, 5, 3),
    createRectStep(HALF_WIDTH - 8, HALF_HEIGHT - 4, 5, 3),
    createOutlineStep(),
    createStyleStep({ fillStyle: palette.feet }),
    drawFill,
    drawBeginPath,
    createRoundRectStep(
      -HALF_WIDTH + 2,
      -HALF_HEIGHT + 2,
      ENEMY_WIDTH - 4,
      ENEMY_HEIGHT - 4,
      6,
    ),
    createOutlineStep(),
    createStyleStep({ fillStyle: palette.body }),
    drawFill,
    createStyleStep({ fillStyle: palette.belly }),
    drawBeginPath,
    createRoundRectStep(
      -HALF_WIDTH + 5,
      -1,
      ENEMY_WIDTH - 10,
      HALF_HEIGHT - 3,
      4,
    ),
    drawFill,
  ]);
