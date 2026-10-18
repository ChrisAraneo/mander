import { getEntityRectangle, PORTAL_ENTITY_BOX } from '@mander/model';
import { describe, expect, it } from 'vitest';

import { createRenderTestLevel } from '../../../test/create-render-test-level';
import { findPortalRectangle } from './find-portal-rectangle';

describe('findPortalRectangle', () => {
  it('should find the box of the portal from its bottom tile when the level has a portal', () => {
    const result = findPortalRectangle(
      createRenderTestLevel(['...P.', '.@.P.', '#####']),
    );

    expect(result).toEqual(
      getEntityRectangle({ x: 3, y: 1 }, PORTAL_ENTITY_BOX),
    );
  });

  it('should find nothing when the level has no portal', () => {
    const result = findPortalRectangle(
      createRenderTestLevel(['.@...', '#####']),
    );

    expect(result).toBeUndefined();
  });
});
