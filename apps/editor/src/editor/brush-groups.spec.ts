import { flatMap, map, size } from 'lodash-es';
import { describe, expect, it } from 'vitest';

import { BRUSH_ROWS } from './brush-groups';
import { BRUSHES } from './brushes';

describe('BRUSH_ROWS', () => {
  it('should lay the groups out in three rows when the picker shows them', () => {
    expect(map(BRUSH_ROWS, (row) => map(row, (group) => group.name))).toEqual([
      ['Empty'],
      ['Blocks', 'Background'],
      ['Hazards', 'Markers'],
    ]);
  });

  it('should hold every brush once in the group it belongs to when the rows are read', () => {
    const grouped = flatMap(BRUSH_ROWS, (row) =>
      flatMap(row, (group) => group.brushes),
    );

    expect(size(grouped)).toBe(size(BRUSHES));
    expect(
      flatMap(BRUSH_ROWS, (row) =>
        flatMap(row, (group) =>
          map(group.brushes, (brush) => brush.group === group.name),
        ),
      ),
    ).not.toContain(false);
  });
});
