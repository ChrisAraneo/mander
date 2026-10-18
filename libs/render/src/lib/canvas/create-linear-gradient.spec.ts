import { describe, expect, it } from 'vitest';

import { drawRecorded } from '../../test/draw-recorded';
import { createLinearGradient } from './create-linear-gradient';

describe('createLinearGradient', () => {
  it('should make the gradient and add its stops when it is given two stops', () => {
    const calls = drawRecorded((context) =>
      createLinearGradient(context, 1, 2, 3, 4, [
        [0, '#000'],
        [0.5, '#888'],
      ]),
    );

    expect(calls).toEqual([
      'createLinearGradient(1, 2, 3, 4)',
      'addColorStop(0, #000)',
      'addColorStop(0.5, #888)',
    ]);
  });

  it('should make a gradient without stops when it is given none', () => {
    const calls = drawRecorded((context) =>
      createLinearGradient(context, 0, 0, 0, 1, []),
    );

    expect(calls).toEqual(['createLinearGradient(0, 0, 0, 1)']);
  });
});
