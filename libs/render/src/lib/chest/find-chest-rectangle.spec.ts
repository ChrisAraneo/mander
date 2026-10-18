import { CHEST_ENTITY_BOX, getEntityRectangle } from '@mander/model';
import { describe, expect, it } from 'vitest';

import { createRenderTestLevel } from '../../test/create-render-test-level';
import { findChestRectangle } from './find-chest-rectangle';

describe('findChestRectangle', () => {
  it('should find the box of the chest when the level has a chest', () => {
    const result = findChestRectangle(
      createRenderTestLevel(['.@.C.', '#####']),
    );

    expect(result).toEqual(
      getEntityRectangle({ x: 3, y: 0 }, CHEST_ENTITY_BOX),
    );
  });

  it('should find nothing when the level has no chest', () => {
    const result = findChestRectangle(
      createRenderTestLevel(['.@...', '#####']),
    );

    expect(result).toBeUndefined();
  });
});
