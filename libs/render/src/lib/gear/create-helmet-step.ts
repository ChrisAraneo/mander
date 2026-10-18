import { createArcStep } from '../canvas/create-arc-step';
import { createContextStyleStep } from '../canvas/create-context-style-step';
import { createLinearGradient } from '../canvas/create-linear-gradient';
import { createMoveToStep } from '../canvas/create-move-to-step';
import { createRoundRectStep } from '../canvas/create-round-rect-step';
import { createSequenceStep } from '../canvas/create-sequence-step';
import { createStyleStep } from '../canvas/create-style-step';
import { drawBeginPath } from '../canvas/draw-begin-path';
import { drawClosePath } from '../canvas/draw-close-path';
import { drawFill } from '../canvas/draw-fill';
import { drawRestore } from '../canvas/draw-restore';
import { drawSave } from '../canvas/draw-save';
import { outline } from '../stroke/outline';
import type { CanvasStep } from '../types/canvas-step';
import { TITANIUM, VISOR_DARK } from './consts';
import { computeGearCoordinate } from './internal/compute-gear-coordinate';

const DOME_CENTER_Y = 0.52;

const DOME_RADIUS = 0.31;

export const createHelmetStep = (
  left: number,
  top: number,
  size: number,
): CanvasStep =>
  createSequenceStep([
    drawSave,
    createStyleStep({ fillStyle: TITANIUM.base }),
    drawBeginPath,
    createRoundRectStep(
      computeGearCoordinate(left, size, 0.28),
      computeGearCoordinate(top, size, 0.5),
      size * 0.44,
      size * 0.16,
      size * 0.06,
    ),
    outline(),
    drawFill,

    drawBeginPath,
    createMoveToStep(
      computeGearCoordinate(left, size, 0.5 - DOME_RADIUS),
      computeGearCoordinate(top, size, DOME_CENTER_Y),
    ),
    createArcStep(
      computeGearCoordinate(left, size, 0.5),
      computeGearCoordinate(top, size, DOME_CENTER_Y),
      size * DOME_RADIUS,
      Math.PI,
      Math.PI * 2,
    ),
    drawClosePath,
    outline(),
    createContextStyleStep((context) => ({
      fillStyle: createLinearGradient(
        context,
        computeGearCoordinate(left, size, 0.5),
        computeGearCoordinate(top, size, DOME_CENTER_Y - DOME_RADIUS),
        computeGearCoordinate(left, size, 0.5),
        computeGearCoordinate(top, size, DOME_CENTER_Y),
        [
          [0, TITANIUM.light],
          [0.5, TITANIUM.base],
          [1, TITANIUM.deep],
        ],
      ),
    })),
    drawFill,
    drawRestore,

    createStyleStep({ fillStyle: TITANIUM.light }),
    drawBeginPath,
    createRoundRectStep(
      computeGearCoordinate(left, size, 0.16),
      computeGearCoordinate(top, size, 0.47),
      size * 0.68,
      size * 0.08,
      size * 0.04,
    ),
    outline(),
    drawFill,

    createStyleStep({ fillStyle: VISOR_DARK }),
    drawBeginPath,
    createRoundRectStep(
      computeGearCoordinate(left, size, 0.29),
      computeGearCoordinate(top, size, 0.36),
      size * 0.42,
      size * 0.08,
      size * 0.03,
    ),
    drawFill,

    createStyleStep({ fillStyle: TITANIUM.deep }),
    drawBeginPath,
    createRoundRectStep(
      computeGearCoordinate(left, size, 0.47),
      computeGearCoordinate(top, size, 0.16),
      size * 0.06,
      size * 0.12,
      size * 0.03,
    ),
    outline(),
    drawFill,
  ]);
