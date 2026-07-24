import type { Palette } from '@mander/generator';

import type { Viewport } from './viewport';

export const drawSky = (
  context: CanvasRenderingContext2D,
  palette: Palette,
  viewport: Viewport,
): void => {
  const sky = context.createLinearGradient(0, 0, 0, viewport.height);
  sky.addColorStop(0, palette.sky[0]);
  sky.addColorStop(0.6, palette.sky[1]);
  sky.addColorStop(1, palette.sky[2]);
  context.fillStyle = sky;
  context.fillRect(0, 0, viewport.width, viewport.height);
};
