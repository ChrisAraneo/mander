import { describe, expect, it } from 'vitest';

import { patchLostHeart } from './patch-lost-heart';

describe('patchLostHeart', () => {
  it('should take one heart away when the player has hearts left', () => {
    const hearts = patchLostHeart({ value: 3 });

    expect(hearts).toEqual({ value: 2 });
  });

  it('should leave the player with no hearts when the player loses the last one', () => {
    const hearts = patchLostHeart({ value: 1 });

    expect(hearts).toEqual({ value: 0 });
  });

  it('should keep the hearts at zero when the player has no hearts left', () => {
    const hearts = patchLostHeart({ value: 0 });

    expect(hearts).toEqual({ value: 0 });
  });

  it('should leave the given hearts alone when it takes one away', () => {
    const given = { value: 3 };

    patchLostHeart(given);

    expect(given).toEqual({ value: 3 });
  });
});
