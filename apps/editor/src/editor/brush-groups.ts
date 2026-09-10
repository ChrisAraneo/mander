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

// the picker lays its groups out in rows, and the groups named together in one
// row sit side by side: the background blocks stand beside the blocks they are
// the dimmer twins of
const ROWS: readonly (readonly string[])[] = Object.freeze([
  Object.freeze([EMPTY]),
  Object.freeze([BLOCKS, BACKGROUND]),
  Object.freeze([HAZARDS, MARKERS]),
]);

const groupOf = (name: string): BrushGroup => ({
  name,
  brushes: filter(BRUSHES, (brush) => brush.group === name),
});

export const BRUSH_ROWS: BrushGroup[][] = map(ROWS, (names) =>
  map(names, groupOf),
);
