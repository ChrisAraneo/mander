import { filter, map } from 'lodash-es';
import { BRUSHES } from './brushes';
import { BACKGROUND, BLOCKS, EMPTY, HAZARDS, MARKERS } from './consts';
import type { BrushGroup } from './types/brush-group';

const ROWS: readonly (readonly string[])[] = Object.freeze([
  Object.freeze([EMPTY]),
  Object.freeze([BLOCKS, BACKGROUND]),
  Object.freeze([HAZARDS, MARKERS]),
]);

const createGroup = (name: string): BrushGroup => ({
  name,
  brushes: filter(BRUSHES, (brush) => brush.group === name),
});

export const BRUSH_ROWS: readonly (readonly BrushGroup[])[] = Object.freeze(
  map(ROWS, (names) => Object.freeze(map(names, createGroup))),
);
