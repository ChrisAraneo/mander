import { describe, expect, it } from 'vitest';

import { drawRecorded } from '../../../test/draw-recorded';
import { GOLD_STAR } from '../consts';
import { createStarFill } from './create-star-fill';

describe('createStarFill', () => {
  it('should make a top-to-bottom gradient in the three star colours when it is given a centre and a radius', () => {
    const calls = drawRecorded((context) =>
      createStarFill(context, 16, 16, 10, GOLD_STAR),
    );

    expect(calls).toEqual([
      'createLinearGradient(16, 6, 16, 26)',
      'addColorStop(0, #FFF8DC)',
      'addColorStop(0.45, #FFC93C)',
      'addColorStop(1, #A66A00)',
    ]);
  });
});
