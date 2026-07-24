import { forEach, times } from 'lodash-es';

import type { HillLayer } from './hill-layer';
import type { Viewport } from './viewport';

const HILL_STEP = 16;

const stepsAcross = (width: number): number[] =>
  times(Math.floor(width / HILL_STEP) + 1, (index) => index * HILL_STEP);

export const drawHillLayer = (
  context: CanvasRenderingContext2D,
  cameraX: number,
  layer: HillLayer,
  color: string,
  viewport: Viewport,
): void => {
  const baseline = viewport.height * layer.baselineRatio;
  context.fillStyle = color;
  context.beginPath();
  context.moveTo(0, viewport.height);
  forEach(stepsAcross(viewport.width), (screenX) => {
    const worldPhase = (screenX + cameraX * layer.parallax) / 210;
    const hillY =
      baseline -
      (Math.sin(worldPhase) + Math.sin(worldPhase * 2.3) * 0.4) *
        layer.amplitude;
    context.lineTo(screenX, hillY);
  });
  context.lineTo(viewport.width, viewport.height);
  context.closePath();
  context.fill();
};
