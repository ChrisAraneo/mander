import type { EditorView } from '../types/editor-view';
import { forEach, range } from 'lodash-es';
import { CELL, COLORS } from '../config/constants';
import { SECTOR_WIDTH, STRUCTURE_HEIGHT } from '@mander/generator';

export const drawGridLines = (
  context: CanvasRenderingContext2D,
  view: EditorView,
): void => {
  context.strokeStyle = COLORS.line;
  context.lineWidth = 1;
  context.beginPath();

  forEach(range(SECTOR_WIDTH + 1), (column) => {
    context.moveTo(column * CELL + 0.5, 0);
    context.lineTo(column * CELL + 0.5, view.cssHeight);
  });

  forEach(range(STRUCTURE_HEIGHT + 1), (row) => {
    context.moveTo(0, row * CELL + 0.5);
    context.lineTo(view.cssWidth, row * CELL + 0.5);
  });

  context.stroke();
};
