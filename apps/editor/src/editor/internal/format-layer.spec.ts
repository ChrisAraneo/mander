import { TILE_AIR, TILE_BRICK } from '@mander/model';
import { describe, expect, it } from 'vitest';

import { formatLayer } from './format-layer';

describe('formatLayer', () => {
  it('should write every row of the layer when the layer is painted', () => {
    expect(
      formatLayer([
        [TILE_AIR, TILE_BRICK],
        [TILE_BRICK, TILE_BRICK],
      ]),
    ).toBe('[\n    [__, BR],\n    [BR, BR],\n  ]');
  });

  it('should write an empty layer when nothing is painted on it', () => {
    expect(formatLayer([[TILE_AIR, TILE_AIR]])).toBe('[]');
  });

  it('should write an empty layer when the layer has no rows', () => {
    expect(formatLayer([])).toBe('[]');
  });
});
