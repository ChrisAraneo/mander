import {
  computeSpikeTriangles,
  type Level,
  spikeOrientation,
  spikeShape,
} from '@mander/engine';
import { forEach } from 'lodash-es';

import { strokeOutline } from '../stroke/stroke';

export const drawSpike = (
  context: CanvasRenderingContext2D,
  level: Level,
  tileX: number,
  tileY: number,
): void => {
  forEach(
    computeSpikeTriangles(
      tileX,
      tileY,
      spikeOrientation(level, tileX, tileY),
      spikeShape(level, tileX, tileY),
    ),
    ([left, apex, right]) => {
      const gradient = context.createLinearGradient(
        left.x,
        left.y,
        left.x,
        apex.y,
      );
      gradient.addColorStop(0, '#8B90A3');
      gradient.addColorStop(1, '#DFE3EE');

      context.beginPath();
      context.moveTo(left.x, left.y);
      context.lineTo(apex.x, apex.y);
      context.lineTo(right.x, right.y);
      context.closePath();
      strokeOutline(context);
      context.fillStyle = gradient;
      context.fill();
    },
  );
};
