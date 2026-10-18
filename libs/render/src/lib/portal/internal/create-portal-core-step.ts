import type { Rectangle } from '@mander/model';
import { createContextStyleStep } from '../../canvas/create-context-style-step';
import { createEllipseStep } from '../../canvas/create-ellipse-step';
import { createRadialGradient } from '../../canvas/create-radial-gradient';
import { createSequenceStep } from '../../canvas/create-sequence-step';
import { drawBeginPath } from '../../canvas/draw-begin-path';
import { drawFill } from '../../canvas/draw-fill';
import { outline } from '../../stroke/outline';
import type { CanvasStep } from '../../types/canvas-step';
import type { ColorStop } from '../../types/color-stop';

const SWIRL_STOPS: readonly ColorStop[] = [
  [0, '#E9DCFF'],
  [0.45, '#8D55E0'],
  [1, '#3C2470'],
];

export const createPortalCoreStep = (
  portal: Rectangle,
  centerX: number,
  centerY: number,
  pulse: number,
): CanvasStep =>
  createSequenceStep([
    drawBeginPath,
    createEllipseStep(
      centerX,
      centerY,
      (portal.width / 2) * pulse,
      (portal.height / 2) * pulse,
      0,
      0,
      Math.PI * 2,
    ),
    outline(),
    createContextStyleStep((context) => ({
      fillStyle: createRadialGradient(
        context,
        centerX,
        centerY,
        2,
        centerX,
        centerY,
        portal.width / 2 + 8,
        SWIRL_STOPS,
      ),
    })),
    drawFill,
  ]);
