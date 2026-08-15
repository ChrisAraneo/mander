import { type CanvasStep, sequence, stroke, styled } from '../canvas';
import { STROKE_COLOR, STROKE_WIDTH } from './consts';

export const outline = (lineWidth = 0): CanvasStep =>
  sequence([
    styled({
      strokeStyle: STROKE_COLOR,
      lineWidth: lineWidth + STROKE_WIDTH * 2,
      lineJoin: 'round',
    }),
    stroke,
  ]);
