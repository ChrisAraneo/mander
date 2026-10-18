import { describe, expect, it } from 'vitest';

import { GOLD_STAR } from '../../star/consts';
import { createStarsArt } from './create-stars-art';

describe('createStarsArt', () => {
  it('should make gold star art for the count when it is given a count', () => {
    const result = createStarsArt(3);

    expect(result).toEqual({ kind: 'STARS', count: 3, colors: GOLD_STAR });
  });
});
