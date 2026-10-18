import { describe, expect, it } from 'vitest';

import { drawRecorded } from '../../test/draw-recorded';
import { strokeOutline } from './stroke-outline';

describe('strokeOutline', () => {
  it('should outline the path on the canvas when it is given an extra width', () => {
    const calls = drawRecorded((context) => strokeOutline(context, 2));

    expect(calls).toEqual([
      'set strokeStyle(#0f0d16)',
      'set lineWidth(6)',
      'set lineJoin(round)',
      'stroke()',
    ]);
  });

  it('should outline the path at the standard width when no extra width is given', () => {
    const calls = drawRecorded((context) => strokeOutline(context));

    expect(calls).toEqual([
      'set strokeStyle(#0f0d16)',
      'set lineWidth(4)',
      'set lineJoin(round)',
      'stroke()',
    ]);
  });
});
