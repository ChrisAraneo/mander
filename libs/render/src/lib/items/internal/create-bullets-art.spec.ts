import { describe, expect, it } from 'vitest';

import { createBulletsArt } from './create-bullets-art';

describe('createBulletsArt', () => {
  it('should make bullet art for the count when it is given a count', () => {
    const result = createBulletsArt(4);

    expect(result).toEqual({ kind: 'BULLETS', count: 4 });
  });
});
