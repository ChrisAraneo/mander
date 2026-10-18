import { describe, expect, it } from 'vitest';

import { drawRecorded } from '../../test/draw-recorded';
import { createRadialGradient } from './create-radial-gradient';

describe('createRadialGradient', () => {
  it('should make the gradient and add its stops when it is given a stop', () => {
    const calls = drawRecorded((context) =>
      createRadialGradient(context, 1, 2, 3, 4, 5, 6, [[1, '#FFF']]),
    );

    expect(calls).toEqual([
      'createRadialGradient(1, 2, 3, 4, 5, 6)',
      'addColorStop(1, #FFF)',
    ]);
  });
});
