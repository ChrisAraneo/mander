import { groupBy, map, toPairs } from 'lodash-es';

import type { Brush } from './brush';
import { BRUSHES } from './brushes';

export interface BrushGroup {
  name: string;
  brushes: Brush[];
}

export const BRUSH_GROUPS: BrushGroup[] = map(
  toPairs(groupBy(BRUSHES, (brush) => brush.group)),
  ([name, brushes]): BrushGroup => ({ name, brushes }),
);
