import { describe, expect, it } from 'vitest';

import { drawRecorded } from '../../test/draw-recorded';
import { outline } from './outline';

describe('outline', () => {
  it('should outline the path at the standard width when no extra width is given', () => {
    const calls = drawRecorded(outline());

    expect(calls).toEqual([
      'set strokeStyle(#0f0d16)',
      'set lineWidth(4)',
      'set lineJoin(round)',
      'stroke()',
    ]);
  });

  it('should widen the outline when an extra width is given', () => {
    const calls = drawRecorded(outline(3));

    expect(calls).toEqual([
      'set strokeStyle(#0f0d16)',
      'set lineWidth(7)',
      'set lineJoin(round)',
      'stroke()',
    ]);
  });
});
