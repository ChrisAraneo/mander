import { createContextStyleStep } from '../canvas/create-context-style-step';
import { createFillRectStep } from '../canvas/create-fill-rect-step';
import { createLinearGradient } from '../canvas/create-linear-gradient';
import { draw } from '../canvas/draw';
import type { Palette } from '../types/palette';
import type { Viewport } from '../types/viewport';

export const drawSky = (
  context: CanvasRenderingContext2D,
  palette: Palette,
  viewport: Viewport,
): void =>
  draw(
    context,
    createContextStyleStep((target) => ({
      fillStyle: createLinearGradient(target, 0, 0, 0, viewport.height, [
        [0, palette.sky[0]],
        [0.6, palette.sky[1]],
        [1, palette.sky[2]],
      ]),
    })),
    createFillRectStep(0, 0, viewport.width, viewport.height),
  );
