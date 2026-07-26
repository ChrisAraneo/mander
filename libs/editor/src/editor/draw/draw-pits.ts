import { type Structure, STRUCTURE_HEIGHT, AIR } from '@mander/generator';
import { forEach, noop, range } from 'lodash-es';
import { match } from 'ts-pattern';
import { COLORS, CELL } from '../../constants';
import type { EditorView } from '../types/editor-view';

const ROWS = range(STRUCTURE_HEIGHT);

export const drawPits = (
  context: CanvasRenderingContext2D,
  grid: Structure,
  view: EditorView,
): void => {
  forEach(ROWS, (column) =>
    match(grid[STRUCTURE_HEIGHT - 1][column])
      .with(AIR, () => {
        context.fillStyle = COLORS.pit;
        context.fillRect(column * CELL, 0, CELL, view.cssHeight);
      })
      .otherwise(noop),
  );
};
