import { type Cannon, chain } from '@mander/model';
import { createConditionalStep } from '../canvas/create-conditional-step';
import { createScaleStep } from '../canvas/create-scale-step';
import { createSequenceStep } from '../canvas/create-sequence-step';
import { createTranslateStep } from '../canvas/create-translate-step';
import { drawRestore } from '../canvas/draw-restore';
import { drawSave } from '../canvas/draw-save';
import { computeFacing } from '../compute-facing';
import type { CanvasStep } from '../types/canvas-step';
import { computeCannonCharge } from './internal/compute-cannon-charge';
import { HALF_TILE } from './internal/consts';
import { createCannonChargeStep } from './internal/create-cannon-charge-step';
import { drawCannonBarrel } from './internal/draw-cannon-barrel';
import { drawCannonMount } from './internal/draw-cannon-mount';
import { drawCannonRivets } from './internal/draw-cannon-rivets';
import { drawCannonTrunnion } from './internal/draw-cannon-trunnion';

export const createCannonStep = (cannon: Cannon): CanvasStep =>
  chain({
    facing: computeFacing(cannon.statuses.isFacingRight),
    charge: computeCannonCharge(cannon),
  })
    .thru(({ facing, charge }) =>
      createSequenceStep([
        drawSave,
        createTranslateStep(
          cannon.position.x + HALF_TILE,
          cannon.position.y + HALF_TILE,
        ),
        drawCannonMount,
        drawCannonRivets,
        createScaleStep(facing, 1),
        drawCannonBarrel,
        drawCannonTrunnion,
        createConditionalStep(charge > 0, createCannonChargeStep(charge)),
        drawRestore,
      ]),
    )
    .value();
