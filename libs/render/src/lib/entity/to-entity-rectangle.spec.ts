import { CHEST_ENTITY_BOX, getEntityRectangle } from '@mander/model';
import { describe, expect, it } from 'vitest';

import { toEntityRectangle } from './to-entity-rectangle';

describe('toEntityRectangle', () => {
  it('should place the box on the tile when a tile is given', () => {
    const result = toEntityRectangle({ x: 3, y: 1 }, CHEST_ENTITY_BOX);

    expect(result).toEqual(
      getEntityRectangle({ x: 3, y: 1 }, CHEST_ENTITY_BOX),
    );
  });

  it('should give nothing when no tile is given', () => {
    const result = toEntityRectangle(null, CHEST_ENTITY_BOX);

    expect(result).toBeUndefined();
  });
});
