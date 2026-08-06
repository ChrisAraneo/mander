import type { CanvasStep } from '../canvas/canvas-step';
import { stroke, styled } from '../canvas/commands';
import { paint, sequence } from '../canvas/paint';

export const STROKE_COLOR = '#000000';
export const STROKE_WIDTH = 2;

export const outline = (lineWidth = 0): CanvasStep =>
  sequence([
    styled({
      strokeStyle: STROKE_COLOR,
      lineWidth: lineWidth + STROKE_WIDTH * 2,
      lineJoin: 'round',
    }),
    stroke,
  ]);

export const strokeOutline = (
  context: CanvasRenderingContext2D,
  lineWidth = 0,
): void => paint(context, outline(lineWidth));
