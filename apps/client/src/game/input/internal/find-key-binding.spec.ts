import { describe, expect, it } from 'vitest';

import { findKeyBinding } from './find-key-binding';

describe('findKeyBinding', () => {
  it('should find the binding when the key is bound', () => {
    expect(findKeyBinding('KeyX')).toEqual({
      code: 'KeyX',
      start: { type: 'SHOOT' },
    });
  });

  it('should find nothing when the key is not bound', () => {
    expect(findKeyBinding('KeyQ')).toBeUndefined();
  });
});
