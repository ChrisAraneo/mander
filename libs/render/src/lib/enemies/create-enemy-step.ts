import { ENEMY_DEATH_SECONDS, isAlive } from '@mander/engine';
import { type Enemy, chain } from '@mander/model';
import { assign } from 'lodash-es';
import { createScaleStep } from '../canvas/create-scale-step';
import { createSequenceStep } from '../canvas/create-sequence-step';
import { createTranslateStep } from '../canvas/create-translate-step';
import { drawRestore } from '../canvas/draw-restore';
import { drawSave } from '../canvas/draw-save';
import { computeDeathProgress } from '../compute-death-progress';
import { computeFacing } from '../compute-facing';
import type { CanvasStep } from '../types/canvas-step';
import { computeEnemySquash } from './internal/compute-enemy-squash';
import { computeEnemyWobble } from './internal/compute-enemy-wobble';
import { HALF_HEIGHT, HALF_WIDTH } from './internal/consts';
import { createEnemyFigureStep } from './internal/create-enemy-figure-step';
import { getEnemyPalette } from './internal/get-enemy-palette';

const DEATH_SWELL = 0.35;

export const createEnemyStep = (enemy: Enemy, time: number): CanvasStep =>
  chain({
    isDying: !isAlive(enemy),
    progress: computeDeathProgress(enemy.timers.death, ENEMY_DEATH_SECONDS),
    palette: getEnemyPalette(enemy.kind),
  })
    .thru((stage) =>
      assign({}, stage, {
        squash: computeEnemySquash(stage.progress),
        facing: computeFacing(enemy.statuses.isFacingRight),
        wobble: computeEnemyWobble(enemy, stage.isDying, time),
      }),
    )
    .thru(({ isDying, progress, palette, squash, facing, wobble }) =>
      createSequenceStep([
        drawSave,
        createTranslateStep(
          enemy.position.x + HALF_WIDTH,
          enemy.position.y + HALF_HEIGHT + wobble + HALF_HEIGHT * (1 - squash),
        ),
        createScaleStep(facing * (1 + progress * DEATH_SWELL), squash),
        createEnemyFigureStep(enemy, palette, isDying, time),
        drawRestore,
      ]),
    )
    .value();
