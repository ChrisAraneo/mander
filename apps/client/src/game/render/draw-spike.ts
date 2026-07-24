import { spikeTriangles } from '@mander/generator';

export const drawSpike = (
  context: CanvasRenderingContext2D,
  tileX: number,
  tileY: number,
): void => {
  context.strokeStyle = '#333A4F';
  context.lineWidth = 1;
  for (const [left, apex, right] of spikeTriangles(tileX, tileY)) {
    const gradient = context.createLinearGradient(
      left.x,
      left.y,
      left.x,
      apex.y,
    );
    gradient.addColorStop(0, '#8B90A3');
    gradient.addColorStop(1, '#DFE3EE');
    context.fillStyle = gradient;
    context.beginPath();
    context.moveTo(left.x, left.y);
    context.lineTo(apex.x, apex.y);
    context.lineTo(right.x, right.y);
    context.closePath();
    context.fill();
    context.stroke();
  }
};
