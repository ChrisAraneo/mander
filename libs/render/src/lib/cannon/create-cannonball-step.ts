import type { Cannonball } from '@mander/model';
import { chain } from '@mander/utils';
import { createScaleStep } from '../canvas/create-scale-step';
import { createSequenceStep } from '../canvas/create-sequence-step';
import { createTranslateStep } from '../canvas/create-translate-step';
import { drawRestore } from '../canvas/draw-restore';
import { drawSave } from '../canvas/draw-save';
import { computeVelocityFacing } from '../compute-velocity-facing';
import type { CanvasStep } from '../types/canvas-step';
import { CANNONBALL_RADIUS } from './internal/consts';
import { drawCannonballIron } from './internal/draw-cannonball-iron';
import { drawCannonballTrail } from './internal/draw-cannonball-trail';

export const createCannonballStep = (cannonball: Cannonball): CanvasStep =>
  chain(computeVelocityFacing(cannonball.velocity.x.current))
    .thru((facing) =>
      createSequenceStep([
        drawSave,
        createTranslateStep(
          cannonball.position.x + CANNONBALL_RADIUS,
          cannonball.position.y + CANNONBALL_RADIUS,
        ),
        createScaleStep(facing, 1),
        drawCannonballTrail,
        drawCannonballIron,
        drawRestore,
      ]),
    )
    .value();
