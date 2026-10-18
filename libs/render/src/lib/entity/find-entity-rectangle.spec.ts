import { CHEST_ENTITY_BOX, getEntityRectangle } from '@mander/model';
import { describe, expect, it } from 'vitest';

import { findEntityRectangle } from './find-entity-rectangle';

describe('findEntityRectangle', () => {
  it('should place the box on the tile when a tile is given', () => {
    const result = findEntityRectangle({ x: 3, y: 1 }, CHEST_ENTITY_BOX);

    expect(result).toEqual(
      getEntityRectangle({ x: 3, y: 1 }, CHEST_ENTITY_BOX),
    );
  });

  it('should find nothing when no tile is given', () => {
    const result = findEntityRectangle(null, CHEST_ENTITY_BOX);

    expect(result).toBeUndefined();
  });
});
