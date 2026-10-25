import { describe, expect, it } from 'vitest';

import { drawRecorded } from '../../test/draw-recorded';
import { createOutlineStep } from './create-outline-step';

describe('createOutlineStep', () => {
  it('should outline the path at the standard width when no extra width is given', () => {
    const calls = drawRecorded(createOutlineStep());

    expect(calls).toEqual([
      'set strokeStyle(#0f0d16)',
      'set lineWidth(4)',
      'set lineJoin(round)',
      'stroke()',
    ]);
  });

  it('should widen the outline when an extra width is given', () => {
    const calls = drawRecorded(createOutlineStep(3));

    expect(calls).toEqual([
      'set strokeStyle(#0f0d16)',
      'set lineWidth(7)',
      'set lineJoin(round)',
      'stroke()',
    ]);
  });

  it('should outline the path in the given colour when a colour is given', () => {
    const calls = drawRecorded(createOutlineStep(0, '#FFFFFF'));

    expect(calls).toEqual([
      'set strokeStyle(#FFFFFF)',
      'set lineWidth(4)',
      'set lineJoin(round)',
      'stroke()',
    ]);
  });
});
