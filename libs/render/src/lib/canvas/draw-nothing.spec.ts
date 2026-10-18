import { describe, expect, it } from 'vitest';

import { createRecordingContext } from '../../test/create-recording-context';
import { drawRecorded } from '../../test/draw-recorded';
import { drawNothing } from './draw-nothing';

describe('drawNothing', () => {
  it('should draw nothing when it is applied to a canvas', () => {
    const calls = drawRecorded(drawNothing);

    expect(calls).toEqual([]);
  });

  it('should hand back the same canvas when it is applied to a canvas', () => {
    const { context } = createRecordingContext();

    const result = drawNothing(context);

    expect(result).toBe(context);
  });
});
