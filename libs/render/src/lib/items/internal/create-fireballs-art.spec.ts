import { describe, expect, it } from 'vitest';

import { createFireballsArt } from './create-fireballs-art';

describe('createFireballsArt', () => {
  it('should make fireball art for the count when it is given a count', () => {
    const result = createFireballsArt(2);

    expect(result).toEqual({ kind: 'FIREBALLS', count: 2 });
  });
});
