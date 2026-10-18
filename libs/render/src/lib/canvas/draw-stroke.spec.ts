import { describe, expect, it } from 'vitest';

import { createRecordingContext } from '../../test/create-recording-context';
import { drawRecorded } from '../../test/draw-recorded';
import { drawStroke } from './draw-stroke';

describe('drawStroke', () => {
  it('should outline the current path when it is applied to a canvas', () => {
    const calls = drawRecorded(drawStroke);

    expect(calls).toEqual(['stroke()']);
  });

  it('should hand back the same canvas when it outlines', () => {
    const { context } = createRecordingContext();

    const result = drawStroke(context);

    expect(result).toBe(context);
  });
});
