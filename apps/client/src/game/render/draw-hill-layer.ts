import { VIEW_HEIGHT, VIEW_WIDTH } from './constants';

export function drawHillLayer(
  context: CanvasRenderingContext2D,
  cameraX: number,
  parallax: number,
  color: string,
  amplitude: number,
  baseline: number,
): void {
  context.fillStyle = color;
  context.beginPath();
  context.moveTo(0, VIEW_HEIGHT);
  for (let screenX = 0; screenX <= VIEW_WIDTH; screenX += 16) {
    const worldPhase = (screenX + cameraX * parallax) / 210;
    const hillY =
      baseline -
      (Math.sin(worldPhase) + Math.sin(worldPhase * 2.3) * 0.4) * amplitude;
    context.lineTo(screenX, hillY);
  }
  context.lineTo(VIEW_WIDTH, VIEW_HEIGHT);
  context.closePath();
  context.fill();
}
