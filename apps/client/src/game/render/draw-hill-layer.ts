import type { HillLayer } from './hill-layer';
import type { Viewport } from './viewport';

const HILL_STEP = 16;

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
  for (let screenX = 0; screenX <= viewport.width; screenX += HILL_STEP) {
    const worldPhase = (screenX + cameraX * layer.parallax) / 210;
    const hillY =
      baseline -
      (Math.sin(worldPhase) + Math.sin(worldPhase * 2.3) * 0.4) *
        layer.amplitude;
    context.lineTo(screenX, hillY);
  }
  context.lineTo(viewport.width, viewport.height);
  context.closePath();
  context.fill();
};
