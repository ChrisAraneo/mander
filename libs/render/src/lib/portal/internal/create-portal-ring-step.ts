import type { Rectangle } from '@mander/utils';
import { createEllipseStep } from '../../canvas/create-ellipse-step';
import { createSequenceStep } from '../../canvas/create-sequence-step';
import { drawBeginPath } from '../../canvas/draw-begin-path';
import { drawStroke } from '../../canvas/draw-stroke';
import type { CanvasStep } from '../../types/canvas-step';

export const createPortalRingStep = (
  portal: Rectangle,
  centerX: number,
  centerY: number,
  pulse: number,
  angle: number,
): CanvasStep =>
  createSequenceStep([
    drawBeginPath,
    createEllipseStep(
      centerX,
      centerY,
      (portal.width / 2 - 4) * pulse,
      (portal.height / 2 - 6) * pulse,
      0,
      angle,
      angle + Math.PI * 0.6,
    ),
    drawStroke,
  ]);
