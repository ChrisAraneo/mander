import { TILE_AIR, TILE_DIRT } from '@mander/model';
import { describe, expect, it } from 'vitest';

import { isFloorRow } from './is-floor-row';

describe('isFloorRow', () => {
  it('should count the row as floor when more than half of it is solid', () => {
    const result = isFloorRow([TILE_DIRT, TILE_DIRT, TILE_AIR]);

    expect(result).toBe(true);
  });

  it('should not count the row as floor when exactly half of it is solid', () => {
    const result = isFloorRow([TILE_DIRT, TILE_AIR]);

    expect(result).toBe(false);
  });

  it('should not count the row as floor when the row is empty', () => {
    const result = isFloorRow([]);

    expect(result).toBe(false);
  });
});
