import { TILE_AIR, TILE_BRICK } from '@mander/model';
import { describe, expect, it } from 'vitest';

import { formatRow } from './format-row';

describe('formatRow', () => {
  it('should write the aliases of the row after the indent when the row has cells', () => {
    expect(formatRow([TILE_AIR, TILE_BRICK], '    ')).toBe('    [__, BR],');
  });

  it('should write an empty row when the row has no cells', () => {
    expect(formatRow([], '  ')).toBe('  [],');
  });
});
