import { fillRect, styledWith } from '../canvas/commands';
import { linearGradient } from '../canvas/gradient';
import { paint } from '../canvas/paint';
import type { Palette } from '../palette/palette';
import type { Viewport } from '../viewport/viewport';

export const drawSky = (
  context: CanvasRenderingContext2D,
  palette: Palette,
  viewport: Viewport,
): void =>
  paint(
    context,
    styledWith((target) => ({
      fillStyle: linearGradient(target, 0, 0, 0, viewport.height, [
        [0, palette.sky[0]],
        [0.6, palette.sky[1]],
        [1, palette.sky[2]],
      ]),
    })),
    fillRect(0, 0, viewport.width, viewport.height),
  );
