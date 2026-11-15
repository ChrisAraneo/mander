import { STAR, TWO_BULLETS } from '@mander/model';
import { describe, expect, it } from 'vitest';

import { isStar } from './is-star';

describe('isStar', () => {
  it('should say yes when the item gives a star', () => {
    const isStarItem = isStar(STAR);

    expect(isStarItem).toBe(true);
  });

  it('should say no when the item gives something else', () => {
    const isStarItem = isStar(TWO_BULLETS);

    expect(isStarItem).toBe(false);
  });
});
