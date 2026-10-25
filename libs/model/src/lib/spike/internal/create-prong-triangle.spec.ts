import { describe, expect, it } from 'vitest';

import { PRONG_WIDTH } from '../consts';
import { createProngTriangle } from './create-prong-triangle';

describe('createProngTriangle', () => {
  it('should put both corners on the base and the tip in the middle at the apex when it is given a prong', () => {
    expect(createProngTriangle(130, { base: 128, apex: 106 })).toEqual([
      { x: 130, y: 128 },
      { x: 130 + PRONG_WIDTH / 2, y: 106 },
      { x: 130 + PRONG_WIDTH, y: 128 },
    ]);
  });

  it('should start the triangle at zero when the prong starts at zero', () => {
    expect(createProngTriangle(0, { base: 0, apex: 0 })).toEqual([
      { x: 0, y: 0 },
      { x: PRONG_WIDTH / 2, y: 0 },
      { x: PRONG_WIDTH, y: 0 },
    ]);
  });
});
