import { describe, expect, it } from 'vitest';

import { createRecordingContext } from '../../test/create-recording-context';
import { drawRecorded } from '../../test/draw-recorded';
import { draw } from './draw';
import { drawBeginPath } from './draw-begin-path';
import { drawFill } from './draw-fill';

describe('draw', () => {
  it('should draw every step in order when it is given several steps', () => {
    const calls = drawRecorded((context) =>
      draw(context, drawBeginPath, drawFill),
    );

    expect(calls).toEqual(['beginPath()', 'fill()']);
  });

  it('should draw nothing when it is given no steps', () => {
    const calls = drawRecorded((context) => draw(context));

    expect(calls).toEqual([]);
  });

  it('should give back nothing when it has drawn', () => {
    const { context } = createRecordingContext();

    const result = draw(context, drawFill);

    expect(result).toBeUndefined();
  });
});
