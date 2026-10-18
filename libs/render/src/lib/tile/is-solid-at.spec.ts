import { describe, expect, it } from 'vitest';

import { createRenderTestLevel } from '../../test/create-render-test-level';
import { isSolidAt } from './is-solid-at';

const LEVEL = createRenderTestLevel(['.^', '#B']);

describe('isSolidAt', () => {
  it('should find the block when a solid tile stands there', () => {
    expect(isSolidAt(LEVEL, 0, 1)).toBe(true);
    expect(isSolidAt(LEVEL, 1, 1)).toBe(true);
  });

  it('should find nothing solid when the tile is air or a spike', () => {
    expect(isSolidAt(LEVEL, 0, 0)).toBe(false);
    expect(isSolidAt(LEVEL, 1, 0)).toBe(false);
  });

  it('should find nothing solid when the place lies outside the level', () => {
    expect(isSolidAt(LEVEL, -1, 1)).toBe(false);
    expect(isSolidAt(LEVEL, 2, 1)).toBe(false);
    expect(isSolidAt(LEVEL, 0, 2)).toBe(false);
  });
});
