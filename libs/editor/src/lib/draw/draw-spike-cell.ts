import { forEach, range } from 'lodash-es';
import { match } from 'ts-pattern';
import { CELL, COLORS } from '../config/constants';

const PRONGS = 3;

export const drawSpikeCell = (
  context: CanvasRenderingContext2D,
  pixelX: number,
  pixelY: number,
  isPointingDown: boolean,
): void => {
  const prongWidth = CELL / PRONGS;
  const prongHeight = CELL * 0.72;
  const base = match(isPointingDown)
    .with(true, () => pixelY)
    .otherwise(() => pixelY + CELL);
  const tip = match(isPointingDown)
    .with(true, () => pixelY + prongHeight)
    .otherwise(() => pixelY + CELL - prongHeight);
  context.fillStyle = COLORS.spike;
  context.strokeStyle = COLORS.spikeOutline;
  context.lineWidth = 1;
  forEach(range(PRONGS), (prong) => {
    const left = pixelX + prong * prongWidth;
    context.beginPath();
    context.moveTo(left, base);
    context.lineTo(left + prongWidth / 2, tip);
    context.lineTo(left + prongWidth, base);
    context.closePath();
    context.fill();
    context.stroke();
  });
};
