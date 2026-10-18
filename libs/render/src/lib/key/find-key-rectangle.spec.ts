import { getEntityRectangle, KEY_ENTITY_BOX } from '@mander/model';
import { describe, expect, it } from 'vitest';

import { createRenderTestState } from '../../test/create-render-test-state';
import { findKeyRectangle } from './find-key-rectangle';

describe('findKeyRectangle', () => {
  it('should find the box of the key when the key is still on the level', () => {
    const result = findKeyRectangle(createRenderTestState(['.@.K.', '#####']));

    expect(result).toEqual(getEntityRectangle({ x: 3, y: 0 }, KEY_ENTITY_BOX));
  });

  it('should find nothing when the player already holds the key', () => {
    const result = findKeyRectangle(
      createRenderTestState(['.@.K.', '#####'], { hasKey: true }),
    );

    expect(result).toBeUndefined();
  });

  it('should find nothing when the level has no key', () => {
    const result = findKeyRectangle(createRenderTestState(['.@...', '#####']));

    expect(result).toBeUndefined();
  });
});
