import { match } from 'ts-pattern';
import { COLORS, CELL } from '../../constants';
import { drawEnemyEyes } from './draw-enemy-eyes';
import { noop } from 'lodash-es';

export const drawEnemyMarker = (
  context: CanvasRenderingContext2D,
  x: number,
  y: number,
  isStranded: boolean,
): void => {
  context.fillStyle = COLORS.enemy;
  context.beginPath();
  context.roundRect(x + 6, y + 6, CELL - 12, CELL - 12, 5);
  context.fill();
  drawEnemyEyes(context, x + CELL / 2, y + CELL / 2);
  match(isStranded)
    .with(true, () => {
      context.strokeStyle = COLORS.stranded;
      context.lineWidth = 2;
      context.strokeRect(x + 2, y + 2, CELL - 4, CELL - 4);
    })
    .otherwise(noop);
};
