import { spikeTriangles } from '@mander/generator';
import { forEach } from 'lodash-es';

export const drawSpike = (
  context: CanvasRenderingContext2D,
  tileX: number,
  tileY: number,
): void => {
  context.strokeStyle = '#333A4F';
  context.lineWidth = 1;
  forEach(spikeTriangles(tileX, tileY), ([left, apex, right]) => {
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
  });
};
