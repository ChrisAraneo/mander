import { describe, expect, it } from 'vitest';

import { draw } from '../lib/canvas/draw';
import { drawBeginPath } from '../lib/canvas/draw-begin-path';
import { drawFill } from '../lib/canvas/draw-fill';
import { drawStroke } from '../lib/canvas/draw-stroke';
import { hashRecorded } from './hash-recorded';

describe('hashRecorded', () => {
  it('should start the fingerprint with the number of calls when it records a drawing', () => {
    const fingerprint = hashRecorded((context) =>
      draw(context, drawBeginPath, drawFill),
    );

    expect(fingerprint).toBe('2:13KKV7V0S16788');
  });

  it('should give the same fingerprint when the same drawing is recorded twice', () => {
    const first = hashRecorded((context) =>
      draw(context, drawBeginPath, drawFill),
    );

    const second = hashRecorded((context) =>
      draw(context, drawBeginPath, drawFill),
    );

    expect(first).toBe(second);
  });

  it('should give another fingerprint when the drawing differs', () => {
    const filled = hashRecorded((context) =>
      draw(context, drawBeginPath, drawFill),
    );

    const stroked = hashRecorded((context) =>
      draw(context, drawBeginPath, drawStroke),
    );

    expect(filled).not.toBe(stroked);
  });
});
