import { applyStyle, type CanvasStep, sequence, stroke } from '../canvas';
import { STROKE_COLOR, STROKE_WIDTH } from './consts';

export const outline = (lineWidth = 0): CanvasStep =>
  sequence([
    applyStyle({
      strokeStyle: STROKE_COLOR,
      lineWidth: lineWidth + STROKE_WIDTH * 2,
      lineJoin: 'round',
    }),
    stroke,
  ]);
