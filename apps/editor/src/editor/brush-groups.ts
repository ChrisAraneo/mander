import { filter, map } from 'lodash-es';

import type { Brush } from './brush';
import {
  BACKGROUND,
  BLOCKS,
  BRUSHES,
  EMPTY,
  HAZARDS,
  MARKERS,
} from './brushes';

export interface BrushGroup {
  name: string;
  brushes: Brush[];
}

const ROWS: readonly (readonly string[])[] = Object.freeze([
  Object.freeze([EMPTY]),
  Object.freeze([BLOCKS, BACKGROUND]),
  Object.freeze([HAZARDS, MARKERS]),
]);

const createGroup = (name: string): BrushGroup => ({
  name,
  brushes: filter(BRUSHES, (brush) => brush.group === name),
});

export const BRUSH_ROWS: BrushGroup[][] = map(ROWS, (names) =>
  map(names, createGroup),
);
