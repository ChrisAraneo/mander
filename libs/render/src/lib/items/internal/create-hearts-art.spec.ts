import { describe, expect, it } from 'vitest';

import { createHeartsArt } from './create-hearts-art';

describe('createHeartsArt', () => {
  it('should make heart art for the count when it is given a count', () => {
    const result = createHeartsArt(2);

    expect(result).toEqual({ kind: 'HEARTS', count: 2 });
  });
});
