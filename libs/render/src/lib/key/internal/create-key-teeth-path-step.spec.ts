import { describe, expect, it } from 'vitest';

import { drawRecorded } from '../../../test/draw-recorded';
import { createKeyTeethPathStep } from './create-key-teeth-path-step';

describe('createKeyTeethPathStep', () => {
  it('should trace the two teeth of the key when it is given the centre of the key', () => {
    const calls = drawRecorded(createKeyTeethPathStep(16, 20));

    expect(calls).toEqual([
      'beginPath()',
      'rect(16, 23, 5, 2.5)',
      'rect(16, 27, 6, 2.5)',
    ]);
  });
});
