import { STRUCTURE_HEIGHT } from '@mander/generator';
import { COLORS, CELL } from '../config/constants';
import type { EditorView } from '../types/editor-view';

export const drawGroundLine = (
  context: CanvasRenderingContext2D,
  view: EditorView,
): void => {
  context.strokeStyle = COLORS.ground;
  context.lineWidth = 2;
  context.beginPath();
  context.moveTo(0, (STRUCTURE_HEIGHT - 1) * CELL);
  context.lineTo(view.cssWidth, (STRUCTURE_HEIGHT - 1) * CELL);
  context.stroke();
};
