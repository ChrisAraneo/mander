import {
  applyStyleWith,
  createLinearGradient,
  fillRect,
  paint,
} from '../canvas';
import type { Palette } from '../palette';
import type { Viewport } from '../viewport';

export const drawSky = (
  context: CanvasRenderingContext2D,
  palette: Palette,
  viewport: Viewport,
): void =>
  paint(
    context,
    applyStyleWith((target) => ({
      fillStyle: createLinearGradient(target, 0, 0, 0, viewport.height, [
        [0, palette.sky[0]],
        [0.6, palette.sky[1]],
        [1, palette.sky[2]],
      ]),
    })),
    fillRect(0, 0, viewport.width, viewport.height),
  );
