import { describe, expect, it } from 'vitest';

import { drawRecorded } from '../../../test/draw-recorded';
import { createHeartFill } from './create-heart-fill';

describe('createHeartFill', () => {
  it('should make a diagonal gradient in the three heart reds when it is given a centre and a lobe size', () => {
    const calls = drawRecorded((context) =>
      createHeartFill(context, 16, 15, 8),
    );

    expect(calls).toEqual([
      'createLinearGradient(8, 4.6, 24, 28.6)',
      'addColorStop(0, #FFC2CE)',
      'addColorStop(0.4, #FF5470)',
      'addColorStop(1, #8E1B33)',
    ]);
  });
});
