import { describe, expect, it } from 'vitest';

import { createCountedArt } from './create-counted-art';

describe('createCountedArt', () => {
  it('should make heart art for the count when the kind is hearts', () => {
    const result = createCountedArt('HEARTS', 2);

    expect(result).toEqual({ kind: 'HEARTS', count: 2 });
  });

  it('should make bullet art for the count when the kind is bullets', () => {
    const result = createCountedArt('BULLETS', 4);

    expect(result).toEqual({ kind: 'BULLETS', count: 4 });
  });
});
