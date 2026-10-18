import { describe, expect, it } from 'vitest';

import { drawRecorded } from '../../../test/draw-recorded';
import { createKeyBowPathStep } from './create-key-bow-path-step';

describe('createKeyBowPathStep', () => {
  it('should trace the ring and the shaft of the key when it is given the centre of the key', () => {
    const calls = drawRecorded(createKeyBowPathStep(16, 20));

    expect(calls).toEqual([
      'beginPath()',
      'arc(16, 15, 4.5, 0, 6.2832)',
      'moveTo(16, 19.5)',
      'lineTo(16, 29)',
    ]);
  });
});
