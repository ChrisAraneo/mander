import { spikeTriangles } from '@mander/generator';

export function drawSpike(
  context: CanvasRenderingContext2D,
  tileX: number,
  tileY: number,
): void {
  context.strokeStyle = '#333a4f';
  context.lineWidth = 1;
  for (const [left, apex, right] of spikeTriangles(tileX, tileY)) {
    const gradient = context.createLinearGradient(
      left.x,
      left.y,
      left.x,
      apex.y,
    );
    gradient.addColorStop(0, '#8b90a3');
    gradient.addColorStop(1, '#dfe3ee');
    context.fillStyle = gradient;
    context.beginPath();
    context.moveTo(left.x, left.y);
    context.lineTo(apex.x, apex.y);
    context.lineTo(right.x, right.y);
    context.closePath();
    context.fill();
    context.stroke();
  }
}
