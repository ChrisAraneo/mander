import { describe, expect, it } from 'vitest';

import { createRecordingContext } from '../../test/create-recording-context';
import { drawRecorded } from '../../test/draw-recorded';
import { drawFill } from './draw-fill';

describe('drawFill', () => {
  it('should fill the current path when it is applied to a canvas', () => {
    const calls = drawRecorded(drawFill);

    expect(calls).toEqual(['fill()']);
  });

  it('should hand back the same canvas when it fills', () => {
    const { context } = createRecordingContext();

    const result = drawFill(context);

    expect(result).toBe(context);
  });
});
